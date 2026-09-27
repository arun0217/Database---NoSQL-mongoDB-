$ErrorActionPreference = "Stop"

$shell = Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongosh") -Filter "mongosh.exe" -File -Recurse | Select-Object -First 1
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
  & $shell.FullName --quiet --file (Join-Path $PSScriptRoot "foodieApp.mongodb.js")
  $shellExitCode = $LASTEXITCODE
}
finally {
  $env:APPDATA = $previousAppData
  $env:LOCALAPPDATA = $previousLocalAppData
}

exit $shellExitCode
