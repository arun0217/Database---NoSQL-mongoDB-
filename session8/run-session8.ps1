$ErrorActionPreference = "Stop"

$shellDirectory = Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongosh"
$shell = Get-ChildItem -Path $shellDirectory -Filter "mongosh.exe" -File -Recurse | Select-Object -First 1
if (-not $shell) {
  throw "MongoDB Shell was not found under %LOCALAPPDATA%\MongoDB\tools\mongosh."
}

$resultsFile = Join-Path $PSScriptRoot "results.txt"
"SESSION 8 - MONGODB USERS AND ROLES" | Set-Content -Path $resultsFile -Encoding UTF8
$uri = "mongodb://127.0.0.1:27018"

Write-Host "Preparing the local administrator used to manage this exercise."
$bootstrapOutput = & $shell.FullName --quiet --norc --file (Join-Path $PSScriptRoot "bootstrap.mongodb.js") $uri 2>&1
$bootstrapExitCode = $LASTEXITCODE
"Preparing the local administrator used to manage this exercise." | Add-Content -Path $resultsFile -Encoding UTF8
$bootstrapOutput | Add-Content -Path $resultsFile -Encoding UTF8
$bootstrapOutput | Out-Host
if ($bootstrapExitCode -ne 0) {
  throw "The local administrator bootstrap failed."
}

Write-Host "Creating the insta_clone users and listing their roles."
$setupOutput = & $shell.FullName --quiet --norc -u "session8Admin" -p "S8-Session8-Admin" --authenticationDatabase "admin" --file (Join-Path $PSScriptRoot "session8.mongodb.js") $uri 2>&1
$setupExitCode = $LASTEXITCODE
"Creating the insta_clone users and listing their roles." | Add-Content -Path $resultsFile -Encoding UTF8
$setupOutput | Add-Content -Path $resultsFile -Encoding UTF8
$setupOutput | Out-Host
if ($setupExitCode -ne 0) {
  throw "The user and role setup failed."
}

Write-Host "Testing that feedViewer cannot insert into posts."
"Testing that feedViewer cannot insert into posts." | Add-Content -Path $resultsFile -Encoding UTF8
$checkOutput = & $shell.FullName --quiet --norc -u "feedViewer" -p "S8-Feed-Viewer" --authenticationDatabase "insta_clone" --file (Join-Path $PSScriptRoot "readonly-check.mongodb.js") $uri 2>&1
$checkExitCode = $LASTEXITCODE
$checkOutput | Add-Content -Path $resultsFile -Encoding UTF8
$checkOutput | Out-Host
if ($checkExitCode -ne 0) {
  throw "The read-only authorization check failed."
}
