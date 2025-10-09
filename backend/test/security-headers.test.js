// Security Headers Test
const https = require('https');
const url = require('url');

// Disable SSL verification for self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const testSecurityHeaders = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3443,
      path: '/api/health',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      console.log('🔒 Security Headers Test Results:\n');
      
      const securityHeaders = {
        'content-security-policy': 'Content Security Policy',
        'x-frame-options': 'Frame Options (Clickjacking Protection)',
        'x-content-type-options': 'Content Type Options (MIME Sniffing Protection)',
        'referrer-policy': 'Referrer Policy',
        'cross-origin-opener-policy': 'Cross-Origin Opener Policy',
        'cross-origin-resource-policy': 'Cross-Origin Resource Policy'
      };

      Object.entries(securityHeaders).forEach(([header, description]) => {
        if (res.headers[header]) {
          console.log(`   ✅ ${description}: ${res.headers[header]}`);
        } else {
          console.log(`   ❌ ${description}: Missing`);
        }
      });

      console.log('\n📊 Additional Security Info:');
      console.log(`   🔐 HTTPS: ${res.connection.encrypted ? 'Yes' : 'No'}`);
      console.log(`   📋 Status Code: ${res.statusCode}`);
      console.log(`   🌐 Server: ${res.headers.server || 'Hidden (Good!)'}`);
      
      resolve();
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
};

testSecurityHeaders().catch(console.error);
