$ErrorActionPreference = 'Stop'
$sourcePath = Join-Path (Split-Path $PSScriptRoot -Parent) 'ClaudeBaseline\theme.css'
$overlayPath = Join-Path $PSScriptRoot 'glass.css'
$targetPath = Join-Path $PSScriptRoot 'theme.css'
$sourceBytes = [IO.File]::ReadAllBytes($sourcePath)
$overlayBytes = [IO.File]::ReadAllBytes($overlayPath)
[IO.File]::WriteAllBytes($targetPath, [byte[]]($sourceBytes + [Text.Encoding]::UTF8.GetBytes("`n`n") + $overlayBytes))
Write-Output "Built $targetPath; preserved $($sourceBytes.Length) source bytes."
