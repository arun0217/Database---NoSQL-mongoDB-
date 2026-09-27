$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($env:MONGODB_ATLAS_URI)) {
  throw "Set MONGODB_ATLAS_URI in this PowerShell window to your Atlas connection string. Do not save it in this folder or paste it into chat."
}

$mongoImport = Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA "MongoDB\tools\database-tools") -Filter "mongoimport.exe" -File -Recurse | Select-Object -First 1
if (-not $mongoImport) {
  throw "MongoDB Database Tools were not found under %LOCALAPPDATA%\MongoDB\tools\database-tools."
}

$exportFile = Join-Path $PSScriptRoot "export\zomatoRestaurants.json"
if (-not (Test-Path $exportFile)) {
  throw "The local export is missing. Run .\run-session9.ps1 first."
}

& $mongoImport.FullName --uri $env:MONGODB_ATLAS_URI --db instaClone --collection zomatoRestaurants --file $exportFile --jsonArray --drop
if ($LASTEXITCODE -ne 0) {
  throw "The Atlas import failed. Check the Atlas URI, database user, and network access list."
}

Write-Host "Imported the restaurant export into Atlas database instaClone, collection zomatoRestaurants."