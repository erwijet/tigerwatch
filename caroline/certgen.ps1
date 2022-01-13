#Requires -Version 7

# Generate a set of local ssl certificates for development
$ErrorActionPreference = "SilentlyContinue"
openssl.exe req -x509 -newkey rsa:4096 -keyout priv/certs/privkey.pem -out priv/certs/fullchain.pem -sha256 -days 365
Write-Host $($?? "It doesn't look like openssl is installed. Make sure openssl.exe is avalible in your PATH, then try again" : "Certs generated!")
$ErrorActionPreference = "Continue"