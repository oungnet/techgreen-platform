param(
  [switch]$InstallIfMissing
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
  Write-Host "[setup-local-mysql] $message"
}

function Find-MySqlService {
  $services = Get-Service | Where-Object {
    $_.Name -match "mysql|mariadb" -or $_.DisplayName -match "MySQL|MariaDB"
  }
  return $services | Select-Object -First 1
}

function Ensure-MySqlInstalled {
  $svc = Find-MySqlService
  if ($svc) { return $svc }
  if (-not $InstallIfMissing) {
    throw "MySQL service not found. Re-run with -InstallIfMissing."
  }

  Write-Step "Installing MySQL Server via winget"
  winget install -e --id Oracle.MySQL --accept-package-agreements --accept-source-agreements

  Start-Sleep -Seconds 5
  $svc = Find-MySqlService
  return $svc
}

$mysqlBase = "C:\Program Files\MySQL\MySQL Server 8.4"
$mysqldExe = Join-Path $mysqlBase "bin\mysqld.exe"
$mysqlExe = Join-Path $mysqlBase "bin\mysql.exe"
$myIni = Join-Path $mysqlBase "my.ini"
$dataDir = Join-Path $mysqlBase "data"

function Ensure-MySqlServiceRegistered {
  if (Test-Path $mysqldExe) {
    $existing = Find-MySqlService
    if ($existing) { return }

    if (-not (Test-Path $myIni)) {
      $myIniContent = @"
[mysqld]
basedir=$mysqlBase
datadir=$dataDir
port=3306
"@
      New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
      Set-Content -Path $myIni -Value $myIniContent -Encoding ASCII
    }

    Write-Step "Initializing MySQL data directory"
    & $mysqldExe --initialize-insecure --defaults-file="$myIni" | Out-Null

    Write-Step "Registering MySQL service"
    & $mysqldExe --install MySQL84 --defaults-file="$myIni" | Out-Null
  }
}

$service = Ensure-MySqlInstalled
Ensure-MySqlServiceRegistered
$service = Find-MySqlService
if (-not $service) {
  throw "MySQL service could not be registered."
}
Write-Step "Found service: $($service.Name) [$($service.Status)]"

if ($service.Status -ne "Running") {
  Write-Step "Starting service: $($service.Name)"
  Start-Service -Name $service.Name
}

$portTest = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -WarningAction SilentlyContinue
if (-not $portTest.TcpTestSucceeded) {
  throw "MySQL service is running but port 3306 is not reachable."
}

Write-Step "MySQL local service is ready on 127.0.0.1:3306"
if (Test-Path $mysqlExe) {
  Write-Step "Ensuring database techgreen_db exists"
  & $mysqlExe -u root -e "CREATE DATABASE IF NOT EXISTS techgreen_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | Out-Null
}
Write-Step "Next: run pnpm db:push"
