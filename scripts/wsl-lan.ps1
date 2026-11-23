# Run in Windows PowerShell as Administrator, with WSL and Vite running.
$wslAddress = ((wsl.exe hostname -I).Trim() -split '\s+')[0]
if (-not $wslAddress) { throw 'WSL address not found. Start your WSL distribution.' }
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=5173 connectaddress=$wslAddress connectport=5173
if (-not (Get-NetFirewallRule -Name 'GasCatalogHTTPS' -ErrorAction SilentlyContinue)) {
    New-NetFirewallRule -Name 'GasCatalogHTTPS' -DisplayName 'Gas Catalog HTTPS' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5173 -Profile Private -RemoteAddress LocalSubnet
}
Write-Host "Windows TCP 5173 -> WSL ${wslAddress}:5173. Open https://<Windows Wi-Fi IPv4>:5173 on iPhone."
