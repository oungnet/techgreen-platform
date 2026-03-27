param(
  [Parameter(Mandatory = $true)]
  [string]$BackendUrl,
  [string]$RenderDeployHookUrl = "",
  [string]$GitHubRepo = "oungnet/techgreen-platform",
  [string]$GitHubToken = "",
  [string]$GitHubRunId = ""
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
  Write-Host "[release-ready] $message"
}

function Invoke-JsonGet($url) {
  return Invoke-RestMethod -Method Get -Uri $url -TimeoutSec 30
}

function Test-BackendHealth($url) {
  $healthUrl = "$url/api/health"
  Write-Step "Checking backend health: $healthUrl"
  $body = Invoke-JsonGet $healthUrl
  if (-not $body.status -or $body.status -ne "ok") {
    throw "Health check failed: status is not 'ok'"
  }
  return $body
}

function Trigger-RenderDeployHook($hookUrl) {
  if (-not $hookUrl) { return }
  Write-Step "Triggering Render deploy hook"
  Invoke-RestMethod -Method Post -Uri $hookUrl -TimeoutSec 30 | Out-Null
}

function Wait-BackendHealthy($url, $maxAttempts = 20, $delaySeconds = 15) {
  for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    try {
      $health = Test-BackendHealth $url
      Write-Step "Backend is healthy on attempt $attempt"
      return $health
    } catch {
      if ($attempt -eq $maxAttempts) {
        throw
      }
      Write-Step "Attempt $attempt failed; retrying in $delaySeconds sec"
      Start-Sleep -Seconds $delaySeconds
    }
  }
}

function Trigger-GitHubRunRerun($repo, $token, $runId) {
  if (-not $token -or -not $runId) { return $false }
  Write-Step "Triggering GitHub Actions rerun for run_id=$runId"
  $headers = @{
    Authorization = "Bearer $token"
    Accept        = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
  }
  $url = "https://api.github.com/repos/$repo/actions/runs/$runId/rerun"
  Invoke-RestMethod -Method Post -Headers $headers -Uri $url -TimeoutSec 30 | Out-Null
  return $true
}

$backend = $BackendUrl.TrimEnd("/")
if (-not $backend.StartsWith("https://")) {
  throw "BackendUrl must start with https://"
}

Trigger-RenderDeployHook $RenderDeployHookUrl
$health = Wait-BackendHealthy $backend

$rerunTriggered = Trigger-GitHubRunRerun -repo $GitHubRepo -token $GitHubToken -runId $GitHubRunId

$reportDir = Join-Path (Get-Location) "artifacts"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$reportPath = Join-Path $reportDir "release-ready-report.md"

$secretPage = "https://github.com/$GitHubRepo/settings/secrets/actions"
$actionsPage = "https://github.com/$GitHubRepo/actions"
$runUrl = if ($GitHubRunId) { "https://github.com/$GitHubRepo/actions/runs/$GitHubRunId" } else { "" }

$report = @"
# Release Ready Report

- GeneratedAt: $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
- BackendUrl: $backend
- HealthStatus: $($health.status)
- HealthService: $($health.service)
- HealthTimestamp: $($health.timestamp)
- GitHubRepo: $GitHubRepo
- RerunTriggered: $rerunTriggered

## Next Required Step

1. Open Actions Secret page: $secretPage
2. Set/Update `VITE_API_BASE_URL` = `$backend`
3. Open Actions page: $actionsPage
"@

if ($runUrl) {
  $report += "`n4. Check run: $runUrl`n"
}

Set-Content -Path $reportPath -Value $report -Encoding UTF8

Write-Step "Done"
Write-Step "Report: $reportPath"
Write-Step "Set GitHub secret VITE_API_BASE_URL = $backend"
