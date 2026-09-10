$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repo 'index.html'
$output = Join-Path $repo '.local-index.html'

$html = Get-Content -Path $source -Raw
$html = $html.Replace('./v7.css', './v8.css')
$html = $html.Replace('Video Prototype v7', 'Video Prototype v8 — Archived Final')

$oldScript = '<script src="./v7.js"></script>'
$newScripts = @'
<script src="./v8-wizard.js"></script>
<script src="./v8.js"></script>
<script src="./v8-polish.js"></script>
<script src="./v8-editor.js"></script>
<script src="./v8-interactions.js"></script>
<script src="./tools/local-preview-fallback.js"></script>
'@

if (-not $html.Contains($oldScript)) {
  throw "Expected v7 script tag was not found in index.html. The archive source layout may have changed."
}

$html = $html.Replace($oldScript, $newScripts.Trim())
Set-Content -Path $output -Value $html -Encoding UTF8

Write-Host "Built local archive entrypoint: $output"
Write-Host "Opening in the default browser..."
Start-Process $output
