$ErrorActionPreference = "Stop"

$server = Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongodb") -Filter "mongod.exe" -File -Recurse | Select-Object -First 1
if (-not $server) {
  throw "MongoDB Community Server was not found under %LOCALAPPDATA%\MongoDB\tools\mongodb."
}

$sessionDataDirectory = Join-Path (Join-Path $env:LOCALAPPDATA "MongoDB\data") (Split-Path $PSScriptRoot -Leaf)
$dataDirectory = Join-Path $sessionDataDirectory "db"
$logFile = Join-Path $sessionDataDirectory "mongod.log"
New-Item -ItemType Directory -Force -Path $dataDirectory | Out-Null

Write-Host "Starting MongoDB Community Server from $($server.FullName)"
Write-Host "Database files: $dataDirectory"
Write-Host "Leave this window open while using mongosh. Press Ctrl+C to stop the server."

& $server.FullName --dbpath $dataDirectory --bind_ip 127.0.0.1 --port 27017 --logpath $logFile
exit $LASTEXITCODE
