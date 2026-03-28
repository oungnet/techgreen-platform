param(
  [string]$DataRoot = ".local-mysql"
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
  Write-Host "[stop-local-mysql-user] $message"
}

$root = Resolve-Path "."
$runDir = Join-Path (Join-Path $root $DataRoot) "run"
$pidFile = Join-Path $runDir "mysqld.pid"

if (-not (Test-Path $pidFile)) {
  Write-Step "No pid file found, nothing to stop"
  exit 0
}

$pidRaw = Get-Content $pidFile -ErrorAction SilentlyContinue
if (-not $pidRaw) {
  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
  Write-Step "Empty pid file removed"
  exit 0
}

$processId = [int]$pidRaw
try {
  Stop-Process -Id $processId -Force -ErrorAction Stop
  Write-Step "Stopped process $processId"
} catch {
  Write-Step "Process $processId already stopped"
}

Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
