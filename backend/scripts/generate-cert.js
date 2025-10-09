const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const keysDir = path.join(__dirname, '..', 'keys');
const certPath = path.join(keysDir, 'cert.pem');
const keyPath = path.join(keysDir, 'key.pem');

console.log('🔐 Generating SSL certificates for HTTPS...\n');

// Ensure keys directory exists
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
  console.log('✅ Created keys directory');
}

// Check if certificates already exist
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  console.log('✅ SSL certificates already exist');
  console.log(`   - ${certPath}`);
  console.log(`   - ${keyPath}`);
  process.exit(0);
}

// Try to use OpenSSL if available
try {
  console.log('Attempting to generate certificates with OpenSSL...');
  
  execSync(`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -subj "/C=ZA/ST=WesternCape/L=CapeTown/O=TurtleShellBanking/CN=localhost"`, {
    stdio: 'inherit'
  });
  
  console.log('\n✅ SSL certificates generated successfully with OpenSSL!');
  console.log('📁 Certificate files:');
  console.log(`   - ${certPath}`);
  console.log(`   - ${keyPath}`);
  
} catch (error) {
  console.log('⚠️  OpenSSL not available, using Node.js forge library...\n');
  
  // Install forge if needed and generate certificates
  try {
    // Check if forge is installed
    require.resolve('node-forge');
  } catch (e) {
    console.log('📦 Installing node-forge...');
    execSync('npm install node-forge', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }
  
  // Generate certificates using forge
  const forge = require('node-forge');
  const pki = forge.pki;
  
  console.log('🔑 Generating RSA key pair...');
  const keys = pki.rsa.generateKeyPair(2048);
  
  console.log('📜 Creating certificate...');
  const cert = pki.createCertificate();
  
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  
  const attrs = [
    { name: 'commonName', value: 'localhost' },
    { name: 'countryName', value: 'ZA' },
    { shortName: 'ST', value: 'Western Cape' },
    { name: 'localityName', value: 'Cape Town' },
    { name: 'organizationName', value: 'Turtle Shell Banking' }
  ];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2,
          value: 'localhost'
        },
        {
          type: 7,
          ip: '127.0.0.1'
        }
      ]
    }
  ]);
  
  cert.sign(keys.privateKey, forge.md.sha256.create());
  
  console.log('💾 Writing certificate files...');
  
  fs.writeFileSync(certPath, pki.certificateToPem(cert));
  fs.writeFileSync(keyPath, pki.privateKeyToPem(keys.privateKey));
  
  console.log('\n✅ SSL certificates generated successfully!');
  console.log('📁 Certificate files:');
  console.log(`   - ${certPath}`);
  console.log(`   - ${keyPath}`);
  console.log('\n💡 You can now start the server with HTTPS support');
  console.log('   Run: npm run dev');
}