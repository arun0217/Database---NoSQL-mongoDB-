$ErrorActionPreference = "Stop"

$shellDirectory = Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongosh"
$shell = Get-ChildItem -Path $shellDirectory -Filter "mongosh.exe" -File -Recurse | Select-Object -First 1
if (-not $shell) {
  throw "MongoDB Shell was not found under %LOCALAPPDATA%\MongoDB\tools\mongosh."
}

$settingsDirectory = Join-Path (Join-Path $env:LOCALAPPDATA "MongoDB\mongosh-settings") (Split-Path $PSScriptRoot -Leaf)
New-Item -ItemType Directory -Force -Path $settingsDirectory | Out-Null
$previousAppData = $env:APPDATA
$previousLocalAppData = $env:LOCALAPPDATA

try {
  $env:APPDATA = $settingsDirectory
  $env:LOCALAPPDATA = $settingsDirectory
  & $shell.FullName --quiet --norc --file (Join-Path $PSScriptRoot "session4.mongodb.js") "mongodb://127.0.0.1:27017"
  $shellExitCode = $LASTEXITCODE
}
finally {
  $env:APPDATA = $previousAppData
  $env:LOCALAPPDATA = $previousLocalAppData
}

exit $shellExitCode
