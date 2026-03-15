// Script to generate RSA key pair for RS256
const fs = require('fs');
const { generateKeyPairSync } = require('crypto');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

fs.writeFileSync('private.key', privateKey);
fs.writeFileSync('public.key', publicKey);
console.log('RSA 2048 key pair generated!');
