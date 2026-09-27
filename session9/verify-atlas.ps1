$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($env:MONGODB_ATLAS_URI)) {
  throw "Set MONGODB_ATLAS_URI in this PowerShell window to your Atlas connection string. Do not save it in this folder or paste it into chat."
}

$shellDirectory = Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongosh"
$shell = Get-ChildItem -Path $shellDirectory -Filter "mongosh.exe" -File -Recurse | Select-Object -First 1
if (-not $shell) {
  throw "MongoDB Shell was not found under %LOCALAPPDATA%\MongoDB\tools\mongosh."
}

$verification = 'const count = db.getSiblingDB("instaClone").zomatoRestaurants.countDocuments(); print(`Atlas instaClone.zomatoRestaurants document count: ${count}`); if (count !== 12) { throw new Error(`Expected 12 documents, found ${count}.`); }'
& $shell.FullName --quiet --norc --eval $verification $env:MONGODB_ATLAS_URI
if ($LASTEXITCODE -ne 0) {
  throw "Atlas verification failed."
}