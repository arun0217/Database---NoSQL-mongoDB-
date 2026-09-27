$ErrorActionPreference = "Stop"

$serverDirectory = Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongodb"
$server = Get-ChildItem -Path $serverDirectory -Filter "mongod.exe" -File -Recurse | Select-Object -First 1
if (-not $server) {
  throw "MongoDB Community Server was not found under %LOCALAPPDATA%\MongoDB\tools\mongodb."
}

$sessionDataDirectory = Join-Path (Join-Path $env:LOCALAPPDATA "MongoDB\data") (Split-Path $PSScriptRoot -Leaf)
$dataDirectory = Join-Path $sessionDataDirectory "db"
$logFile = Join-Path $sessionDataDirectory "mongod.log"
New-Item -ItemType Directory -Force -Path $dataDirectory | Out-Null

Write-Host "Starting the session7 local MongoDB server on port 27021."
Write-Host "Database files: $dataDirectory"
Write-Host "Leave this window open while using mongosh. Press Ctrl+C to stop the server."

& $server.FullName --dbpath $dataDirectory --bind_ip 127.0.0.1 --port 27021 --logpath $logFile
exit $LASTEXITCODE