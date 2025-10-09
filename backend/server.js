const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('./app');

require('dotenv').config();

const PORT = process.env.PORT || 3443;

// Function to check if SSL certificates exist
function checkSSLCertificates() {
  const keyPath = path.join(__dirname, 'keys', 'key.pem');
  const certPath = path.join(__dirname, 'keys', 'cert.pem');
  
  return fs.existsSync(keyPath) && fs.existsSync(certPath);
}

// Start server with HTTPS if certificates exist, otherwise HTTP
function startServer() {
  if (checkSSLCertificates()) {
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem'))
    };
    
    const server = https.createServer(options, app);
    server.listen(PORT, () => {
      console.log(`🔐 Secure Banking API running on https://localhost:${PORT}`);
      console.log(`📊 Health check: https://localhost:${PORT}/api/health`);
    });
  } else {
    console.log('⚠️  SSL certificates not found. Starting in HTTP mode.');
    console.log('💡 Run "npm run cert" to generate SSL certificates for HTTPS.');
    
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🏦 Banking API running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
