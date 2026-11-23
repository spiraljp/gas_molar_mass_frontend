import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { isIP } from 'node:net'

const addresses = process.argv.slice(2)
if (!addresses.length || addresses.some((address) => !isIP(address))) {
  throw new Error('Укажите IP ноутбука: npm run cert:generate -- 192.168.1.10')
}
mkdirSync('.certs', { recursive: true })
const openssl = (args) => execFileSync('openssl', args, { stdio: 'inherit' })
if (!existsSync('.certs/ca.pem') || !existsSync('.certs/ca-key.pem')) {
  openssl(['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-sha256', '-days', '365',
    '-keyout', '.certs/ca-key.pem', '-out', '.certs/ca.pem',
    '-subj', '/CN=Gas Catalog Local CA',
    '-addext', 'basicConstraints=critical,CA:TRUE',
    '-addext', 'keyUsage=critical,keyCertSign,cRLSign'])
}
const ips = [...new Set(['127.0.0.1', '::1', ...addresses])]
writeFileSync('.certs/server.ext', [
  'basicConstraints=critical,CA:FALSE',
  'keyUsage=critical,digitalSignature,keyEncipherment',
  'extendedKeyUsage=serverAuth',
  `subjectAltName=DNS:localhost,${ips.map((ip) => `IP:${ip}`).join(',')}`,
].join('\n'))
openssl(['req', '-new', '-newkey', 'rsa:2048', '-nodes',
  '-keyout', '.certs/localhost-key.pem', '-out', '.certs/server.csr', '-subj', '/CN=localhost'])
openssl(['x509', '-req', '-in', '.certs/server.csr', '-CA', '.certs/ca.pem',
  '-CAkey', '.certs/ca-key.pem', '-CAcreateserial', '-out', '.certs/localhost.pem',
  '-days', '365', '-sha256', '-extfile', '.certs/server.ext'])
openssl(['x509', '-in', '.certs/ca.pem', '-outform', 'DER', '-out', '.certs/gas-catalog-ca.cer'])
console.log('Готово. Установите только .certs/gas-catalog-ca.cer на устройства; приватные ключи не передавайте.')
