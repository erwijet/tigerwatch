# Generate a set of local ssl certificates for development
openssl.exe req -x509 -newkey rsa:4096 -keyout priv/certs/privkey.pem -out priv/certs/fullchain.pem -sha256 -days 365
Write-Host "Certs generated!"