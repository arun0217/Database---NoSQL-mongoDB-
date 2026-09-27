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

  $arguments = @("--quiet", "--norc")
  $commands = Get-Content -LiteralPath (Join-Path $PSScriptRoot "mongo-shell-commands.txt")
  foreach ($command in $commands) {
    $command = $command.Trim()
    if (-not $command) {
      continue
    }

    $printCommand = "print('> " + $command.Replace("'", "\'") + "')"
    $arguments += @("--eval", $printCommand, "--eval", $command)
  }
  $arguments += "mongodb://127.0.0.1:27017"

  & $shell.FullName @arguments
  $shellExitCode = $LASTEXITCODE
}
finally {
  $env:APPDATA = $previousAppData
  $env:LOCALAPPDATA = $previousLocalAppData
}

exit $shellExitCode
