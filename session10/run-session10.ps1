$ErrorActionPreference = "Stop"

$shellDirectory = Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongosh"
$shell = Get-ChildItem -Path $shellDirectory -Filter "mongosh.exe" -File -Recurse | Select-Object -First 1
if (-not $shell) {
  throw "MongoDB Shell was not found under %LOCALAPPDATA%\MongoDB\tools\mongosh."
}

$resultsFile = Join-Path $PSScriptRoot "results.txt"
"SESSION 10 - FOOD DELIVERY MINI PROJECT" | Set-Content -Path $resultsFile -Encoding UTF8
$output = & $shell.FullName --quiet --norc --file (Join-Path $PSScriptRoot "session10.mongodb.js") "mongodb://127.0.0.1:27020" 2>&1
$shellExitCode = $LASTEXITCODE
$output | Add-Content -Path $resultsFile -Encoding UTF8
$output | Out-Host

if ($shellExitCode -ne 0) {
  throw "The session10 MongoDB exercise failed. See results.txt for details."
}

Write-Host "Session10 completed successfully. Results are saved in results.txt."