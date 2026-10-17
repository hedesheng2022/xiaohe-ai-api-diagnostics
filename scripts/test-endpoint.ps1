[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [uri]$Url = 'https://api.xiao-he.top/',
    [ValidateRange(1, 120)]
    [int]$TimeoutSeconds = 8
)

if ($Url.Scheme -notin @('http', 'https')) {
    throw 'Only http:// and https:// URLs are supported.'
}

$stopwatch = [Diagnostics.Stopwatch]::StartNew()
try {
    $response = Invoke-WebRequest -Uri $Url -Method Get -MaximumRedirection 0 -TimeoutSec $TimeoutSeconds -ErrorAction Stop
    $preview = (($response.Content -replace '\s+', ' ').Trim())
    if ($preview.Length -gt 240) { $preview = $preview.Substring(0, 240) }
    [pscustomobject]@{
        Url = $Url.AbsoluteUri
        Status = [int]$response.StatusCode
        Ok = $true
        ContentType = $response.Headers['Content-Type']
        ElapsedMs = $stopwatch.ElapsedMilliseconds
        BodyPreview = $preview
    } | ConvertTo-Json -Depth 3
    exit 0
} catch {
    [pscustomobject]@{
        Url = $Url.AbsoluteUri
        Ok = $false
        ElapsedMs = $stopwatch.ElapsedMilliseconds
        Error = $_.Exception.Message
    } | ConvertTo-Json -Depth 3
    exit 1
}

