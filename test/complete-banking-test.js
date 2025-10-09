const https = require('https');

// Custom HTTPS agent to handle self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false
});

class BankingAPITester {
  constructor() {
    this.baseUrl = 'https://localhost:3443';
    this.authToken = null;
    this.testUser = {
      firstName: 'Francois',
      lastName: 'TestUser', 
      email: `test.${Date.now()}@bankingapp.com`,
      password: 'SecureTest123!',
      idNumber: 'ID' + Date.now().toString().slice(-9),
      accountNumber: '12' + Date.now().toString().slice(-8)
    };
  }

  async makeRequest(method, endpoint, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        agent
      };

      const req = https.request(url, options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const response = {
              status: res.statusCode,
              headers: res.headers,
              data: body ? JSON.parse(body) : null
            };
            resolve(response);
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: body
            });
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async testHealthCheck() {
    console.log('\n🏥 Testing Health Check...');
    try {
      const response = await this.makeRequest('GET', '/api/health');
      if (response.status === 200) {
        console.log('✅ Health check passed');
        console.log(`   Message: ${response.data.message}`);
        return true;
      } else {
        console.log('❌ Health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.log('❌ Health check error:', error.message);
      return false;
    }
  }

  async testUserRegistration() {
    console.log('\n👤 Testing User Registration...');
    try {
      const response = await this.makeRequest('POST', '/api/auth/register', this.testUser);
      
      if (response.status === 201) {
        console.log('✅ User registration successful');
        console.log(`   Email: ${this.testUser.email}`);
        console.log(`   Account Number: ${this.testUser.accountNumber}`);
        return true;
      } else {
        console.log('❌ Registration failed:', response.status, response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Registration error:', error.message);
      return false;
    }
  }

  async testUserLogin() {
    console.log('\n🔐 Testing User Login...');
    try {
      const loginData = {
        email: this.testUser.email,
        password: this.testUser.password
      };
      
      const response = await this.makeRequest('POST', '/api/auth/login', loginData);
      
      if (response.status === 200 && response.data.token) {
        this.authToken = response.data.token;
        console.log('✅ Login successful');
        console.log(`   Token: ${this.authToken.substring(0, 30)}...`);
        return true;
      } else {
        console.log('❌ Login failed:', response.status, response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Login error:', error.message);
      return false;
    }
  }

  async testAuthenticatedEndpoints() {
    console.log('\n🛡️ Testing Authenticated Endpoints...');
    
    if (!this.authToken) {
      console.log('❌ No auth token available');
      return false;
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };

    try {
      // Test profile endpoint
      const profileResponse = await this.makeRequest('GET', '/api/auth/profile', null, headers);
      if (profileResponse.status === 200) {
        console.log('✅ Profile endpoint working');
        console.log(`   User: ${profileResponse.data.user?.firstName} ${profileResponse.data.user?.lastName}`);
      } else {
        console.log('❌ Profile endpoint failed:', profileResponse.status);
        return false;
      }

      // Test accounts endpoint
      const accountsResponse = await this.makeRequest('GET', '/api/accounts', null, headers);
      if (accountsResponse.status === 200) {
        console.log('✅ Accounts endpoint working');
        console.log(`   Found ${accountsResponse.data.accounts?.length || 0} accounts`);
      } else {
        console.log('❌ Accounts endpoint failed:', accountsResponse.status);
        return false;
      }

      return true;
    } catch (error) {
      console.log('❌ Authentication test error:', error.message);
      return false;
    }
  }

  async testInternationalPayment() {
    console.log('\n🌍 Testing International Payment...');
    
    if (!this.authToken) {
      console.log('❌ No auth token available');
      return false;
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };
    const paymentData = {
      fromAccount: this.testUser.accountNumber,
      toAccount: '9876543210',
      amount: 150.75,
      currency: 'USD',
      recipientName: 'John International',
      recipientBank: 'Example International Bank',
      swiftCode: 'EXAMPLEGB2L',
      description: 'Test international payment - INSY7314'
    };

    try {
      const response = await this.makeRequest('POST', '/api/payments/international', paymentData, headers);
      
      if (response.status === 201) {
        console.log('✅ International payment created successfully');
        console.log(`   Transaction ID: ${response.data.transaction?.transactionId}`);
        console.log(`   Amount: ${paymentData.currency} ${paymentData.amount}`);
        console.log(`   To: ${paymentData.recipientName}`);
        return response.data.transaction;
      } else {
        console.log('❌ International payment failed:', response.status, response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ International payment error:', error.message);
      return false;
    }
  }

  async testPaymentHistory() {
    console.log('\n📋 Testing Payment History...');
    
    if (!this.authToken) {
      console.log('❌ No auth token available');
      return false;
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };

    try {
      const response = await this.makeRequest('GET', '/api/payments', null, headers);
      
      if (response.status === 200) {
        console.log('✅ Payment history retrieved successfully');
        console.log(`   Found ${response.data.payments?.length || 0} payments`);
        
        if (response.data.payments && response.data.payments.length > 0) {
          const latestPayment = response.data.payments[0];
          console.log(`   Latest Payment: ${latestPayment.transactionId} - ${latestPayment.status}`);
        }
        return true;
      } else {
        console.log('❌ Payment history failed:', response.status, response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Payment history error:', error.message);
      return false;
    }
  }

  async testTransactionEndpoints() {
    console.log('\n💳 Testing Transaction Endpoints...');
    
    if (!this.authToken) {
      console.log('❌ No auth token available');
      return false;
    }

    const headers = { Authorization: `Bearer ${this.authToken}` };

    try {
      const response = await this.makeRequest('GET', '/api/transactions', null, headers);
      
      if (response.status === 200) {
        console.log('✅ Transaction history retrieved successfully');
        console.log(`   Found ${response.data.transactions?.length || 0} transactions`);
        return true;
      } else {
        console.log('❌ Transaction endpoint failed:', response.status, response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Transaction test error:', error.message);
      return false;
    }
  }

  async testSecurityHeaders() {
    console.log('\n🔒 Testing Security Headers...');
    try {
      const response = await this.makeRequest('GET', '/api/health');
      const headers = response.headers;
      
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'referrer-policy',
        'content-security-policy'
      ];

      let passed = 0;
      securityHeaders.forEach(header => {
        if (headers[header]) {
          console.log(`✅ ${header}: ${headers[header]}`);
          passed++;
        } else {
          console.log(`❌ Missing header: ${header}`);
        }
      });

      if (headers['x-powered-by']) {
        console.log('❌ X-Powered-By header should be removed for security');
      } else {
        console.log('✅ X-Powered-By header properly removed');
        passed++;
      }

      return passed >= 4;
    } catch (error) {
      console.log('❌ Security headers test error:', error.message);
      return false;
    }
  }

  async testInputValidation() {
    console.log('\n🛡️ Testing Input Validation...');
    try {
      // Test invalid email format
      const invalidUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'test123',
        idNumber: '123',
        accountNumber: '456'
      };

      const response = await this.makeRequest('POST', '/api/auth/register', invalidUser);
      
      if (response.status === 400) {
        console.log('✅ Input validation working - rejected invalid data');
        return true;
      } else {
        console.log('❌ Input validation failed - accepted invalid data');
        return false;
      }
    } catch (error) {
      console.log('❌ Input validation test error:', error.message);
      return false;
    }
  }

  async testUnauthorizedAccess() {
    console.log('\n🚫 Testing Unauthorized Access Protection...');
    try {
      // Try to access protected endpoint without token
      const response = await this.makeRequest('GET', '/api/auth/profile');
      
      if (response.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
        return true;
      } else {
        console.log('❌ Unauthorized access not blocked properly');
        return false;
      }
    } catch (error) {
      console.log('❌ Unauthorized access test error:', error.message);
      return false;
    }
  }

  async runFullTest() {
    console.log('🏦 FRANCOIS SMIT - INSY7314 BANKING API TEST SUITE');
    console.log('='.repeat(60));

    const tests = [
      { name: 'Health Check', fn: () => this.testHealthCheck() },
      { name: 'User Registration', fn: () => this.testUserRegistration() },
      { name: 'User Login', fn: () => this.testUserLogin() },
      { name: 'Authenticated Endpoints', fn: () => this.testAuthenticatedEndpoints() },
      { name: 'International Payment', fn: () => this.testInternationalPayment() },
      { name: 'Payment History', fn: () => this.testPaymentHistory() },
      { name: 'Transaction Endpoints', fn: () => this.testTransactionEndpoints() },
      { name: 'Security Headers', fn: () => this.testSecurityHeaders() },
      { name: 'Input Validation', fn: () => this.testInputValidation() },
      { name: 'Unauthorized Access Protection', fn: () => this.testUnauthorizedAccess() }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        const result = await test.fn();
        if (result) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${test.name} crashed:`, error.message);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL TEST RESULTS:');
    console.log(`✅ Tests Passed: ${passed}`);
    console.log(`❌ Tests Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Banking API is fully operational and secure.');
      console.log('🚀 Ready for production deployment and frontend integration.');
    } else {
      console.log('\n⚠️ Some tests failed. Review the logs above for details.');
    }

    return failed === 0;
  }
}

// Run the complete test suite
if (require.main === module) {
  const tester = new BankingAPITester();
  tester.runFullTest()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite crashed:', error);
      process.exit(1);
    });
}

module.exports = BankingAPITester;
