$ErrorActionPreference = "Stop"

$shellDirectory = Join-Path $env:LOCALAPPDATA "MongoDB\tools\mongosh"
$shell = Get-ChildItem -Path $shellDirectory -Filter "mongosh.exe" -File -Recurse | Select-Object -First 1
if (-not $shell) {
  throw "MongoDB Shell was not found under %LOCALAPPDATA%\MongoDB\tools\mongosh."
}

$toolsDirectory = Join-Path $env:LOCALAPPDATA "MongoDB\tools\database-tools"
$mongoImport = Get-ChildItem -Path $toolsDirectory -Filter "mongoimport.exe" -File -Recurse | Select-Object -First 1
$mongoExport = Get-ChildItem -Path $toolsDirectory -Filter "mongoexport.exe" -File -Recurse | Select-Object -First 1
if (-not $mongoImport -or -not $mongoExport) {
  throw "MongoDB Database Tools are missing. Follow the install instructions in README.md."
}

function Invoke-MongoTool {
  param(
    [string]$Executable,
    [string[]]$Arguments
  )

  $startInfo = New-Object System.Diagnostics.ProcessStartInfo
  $startInfo.FileName = $Executable
  $startInfo.Arguments = (($Arguments | ForEach-Object { '"' + $_.Replace('"', '\"') + '"' }) -join " ")
  $startInfo.UseShellExecute = $false
  $startInfo.CreateNoWindow = $true
  $startInfo.RedirectStandardOutput = $true
  $startInfo.RedirectStandardError = $true

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $startInfo
  [void]$process.Start()
  $standardOutput = $process.StandardOutput.ReadToEnd()
  $standardError = $process.StandardError.ReadToEnd()
  $process.WaitForExit()

  [pscustomobject]@{
    ExitCode = $process.ExitCode
    StandardOutput = $standardOutput
    StandardError = $standardError
  }
}

$resultsFile = Join-Path $PSScriptRoot "results.txt"
"SESSION 9 - MONGODB TOOLS" | Set-Content -Path $resultsFile -Encoding UTF8
$localUri = "mongodb://127.0.0.1:27019"
$spotifyUri = "mongodb://127.0.0.1:27019/spotifyDB"

Write-Host "Creating spotifyDB.playlists."
$setupOutput = & $shell.FullName --quiet --norc --file (Join-Path $PSScriptRoot "setup-session9.mongodb.js") $localUri 2>&1
$setupExitCode = $LASTEXITCODE
"Creating spotifyDB.playlists." | Add-Content -Path $resultsFile -Encoding UTF8
$setupOutput | Add-Content -Path $resultsFile -Encoding UTF8
$setupOutput | Out-Host
if ($setupExitCode -ne 0) {
  throw "Could not create spotifyDB.playlists."
}

Write-Host "Importing the sample restaurant JSON into spotifyDB.zomatoRestaurants."
$importResult = Invoke-MongoTool -Executable $mongoImport.FullName -Arguments @(
  "--uri", $spotifyUri,
  "--collection", "zomatoRestaurants",
  "--file", (Join-Path $PSScriptRoot "restaurants.json"),
  "--jsonArray", "--drop"
)
"Importing restaurants.json into spotifyDB.zomatoRestaurants." | Add-Content -Path $resultsFile -Encoding UTF8
if ($importResult.ExitCode -ne 0) {
  throw "The local restaurant import failed: $($importResult.StandardError)"
}
"Imported 12 restaurant documents." | Add-Content -Path $resultsFile -Encoding UTF8

$exportDirectory = Join-Path $PSScriptRoot "export"
New-Item -ItemType Directory -Force -Path $exportDirectory | Out-Null
$exportFile = Join-Path $exportDirectory "zomatoRestaurants.json"
Write-Host "Exporting zomatoRestaurants to $exportFile."
$exportResult = Invoke-MongoTool -Executable $mongoExport.FullName -Arguments @(
  "--uri", $spotifyUri,
  "--collection", "zomatoRestaurants",
  "--out", $exportFile,
  "--jsonArray"
)
"Exporting spotifyDB.zomatoRestaurants to export/zomatoRestaurants.json." | Add-Content -Path $resultsFile -Encoding UTF8
if ($exportResult.ExitCode -ne 0) {
  throw "The local restaurant export failed: $($exportResult.StandardError)"
}
"Export completed." | Add-Content -Path $resultsFile -Encoding UTF8

$verifyOutput = & $shell.FullName --quiet --norc --file (Join-Path $PSScriptRoot "verify-session9.mongodb.js") $localUri 2>&1
$verifyExitCode = $LASTEXITCODE
$verifyOutput | Add-Content -Path $resultsFile -Encoding UTF8
$verifyOutput | Out-Host
if ($verifyExitCode -ne 0) {
  throw "The local restaurant document-count check failed."
}

Write-Host "Local setup, import, export, and document count completed."