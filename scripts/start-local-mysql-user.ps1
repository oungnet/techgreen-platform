param(
  [int]$Port = 3307,
  [string]$DataRoot = ".local-mysql",
  [switch]$Reinitialize
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
  Write-Host "[start-local-mysql-user] $message"
}

function Invoke-NativeChecked {
  param(
    [string]$FilePath,
    [string[]]$Arguments,
    [string]$StepName
  )

  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$StepName failed with exit code $LASTEXITCODE"
  }
}

$mysqlBase = "C:\Program Files\MySQL\MySQL Server 8.4"
$mysqldExe = Join-Path $mysqlBase "bin\mysqld.exe"
if (-not (Test-Path $mysqldExe)) {
  throw "mysqld.exe not found at $mysqldExe"
}

$root = Resolve-Path "."
$dataRootPath = Join-Path $root $DataRoot
$dataDir = Join-Path $dataRootPath "data"
$runDir = Join-Path $dataRootPath "run"
$logOut = Join-Path $runDir "mysqld.out.log"
$logErr = Join-Path $runDir "mysqld.err.log"
$pidFile = Join-Path $runDir "mysqld.pid"

New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
New-Item -ItemType Directory -Force -Path $runDir | Out-Null

$mysqlDbDir = Join-Path $dataDir "mysql"
if ($Reinitialize -and (Test-Path $dataDir)) {
  Write-Step "Reinitialize requested: clearing existing data directory"
  Remove-Item -Recurse -Force $dataDir
  New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
}

if (-not (Test-Path $mysqlDbDir)) {
  Write-Step "Initializing data directory at $dataDir"
  Invoke-NativeChecked -FilePath $mysqldExe -Arguments @(
    "--no-defaults",
    "--initialize-insecure",
    "--basedir=$mysqlBase",
    "--datadir=$dataDir"
  ) -StepName "mysqld initialize"
}

if (Test-Path $pidFile) {
  $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
  if ($existingPid) {
    try {
      $existingProc = Get-Process -Id ([int]$existingPid) -ErrorAction Stop
      Write-Step "MySQL already running (PID $($existingProc.Id))"
      Write-Step "DATABASE_URL=mysql://root:@127.0.0.1:$Port/techgreen_db"
      exit 0
    }
    catch {
      Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    }
  }
}

$'args' = @(
  "--no-defaults",
  "--basedir=""$mysqlBase""",
  "--datadir=""$dataDir""",
  "--port=$Port",
  "--bind-address=127.0.0.1",
  "--skip-networking=0",
  "--log-error=""$logErr""",
  "--pid-file=""$pidFile"""
)

Write-Step "Starting mysqld on port $Port"
$proc = Start-Process -FilePath $mysqldExe -ArgumentList $args -RedirectStandardOutput $logOut -RedirectStandardError $logErr -PassThru
Set-Content -Path $pidFile -Value $proc.Id -Encoding ASCII

Start-Sleep -Seconds 5
$proc.Refresh()
if ($proc.HasExited) {
  $recentErrors = ""
  if (Test-Path $logErr) {
    $recentErrors = (Get-Content $logErr -Tail 20 -ErrorAction SilentlyContinue) -join [Environment]::NewLine
  }
  throw "MySQL exited early with code $($proc.ExitCode). $recentErrors"
}
$portCheck = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -WarningAction SilentlyContinue
if (-not $portCheck.TcpTestSucceeded) {
  throw "MySQL process started (PID $($proc.Id)) but port $Port is not reachable. Check logs: $logErr"
}

Write-Step "Ensuring database techgreen_db exists"
$mysqlExe = Join-Path $mysqlBase "bin\mysql.exe"
if (Test-Path $mysqlExe) {
  $ok = $false
  for ($i = 1; $i -le 10; $i++) {
    & $mysqlExe -h 127.0.0.1 -P $Port -u root -e "CREATE DATABASE IF NOT EXISTS techgreen_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if ($LASTEXITCODE -eq 0) {
      $ok = $true
      break
    }
    Start-Sleep -Seconds 1
  }
  if (-not $ok) {
    throw "MySQL started but CREATE DATABASE command failed after retries."
  }
}

Write-Step "Ready"
Write-Step "DATABASE_URL=mysql://root:@127.0.0.1:$Port/techgreen_db"
Write-Step "Stop command: pwsh ./scripts/stop-local-mysql-user.ps1"
