const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const keysDir = path.join(__dirname, 'keys');
const certPath = path.join(keysDir, 'cert.pem');
const keyPath = path.join(keysDir, 'key.pem');

console.log('🔐 Generating SSL certificates for HTTPS...');

// Check if certificates already exist
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  console.log('✅ SSL certificates already exist');
  process.exit(0);
}

// Generate self-signed certificate using OpenSSL
const openssl = spawn('openssl', [
  'req', '-x509', '-nodes', '-days', '365',
  '-newkey', 'rsa:2048',
  '-keyout', keyPath,
  '-out', certPath,
  '-subj', '/CN=localhost'
]);

openssl.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

openssl.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

openssl.on('close', (code) => {
  if (code === 0) {
    console.log('✅ SSL certificates generated successfully');
    console.log('📁 Certificate files:');
    console.log(`   - ${certPath}`);
    console.log(`   - ${keyPath}`);
    console.log('');
    console.log('💡 You can now start the server with HTTPS support');
    console.log('   Run: npm run dev');
  } else {
    console.log('❌ Failed to generate SSL certificates');
    console.log('💡 Make sure OpenSSL is installed on your system');
    console.log('   Alternative: Use HTTP mode (certificates not required)');
  }
});
