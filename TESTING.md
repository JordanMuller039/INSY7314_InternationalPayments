# Banking API Testing Suite

## 🧪 Test Overview

This banking API includes comprehensive testing to ensure security, functionality, and stability before production deployment.

## 📋 Available Tests

### 1. Input Validation Tests (`npm test`)
- **File**: `test/regex.test.js`
- **Purpose**: Validates regex patterns for input sanitization
- **Tests**: Names, emails, account numbers, currencies, amounts, SWIFT codes

### 2. API Functionality Tests (`npm run test:api`)
- **File**: `test/banking-api.test.js`  
- **Purpose**: End-to-end testing of all API endpoints
- **Coverage**:
  - Health check endpoint
  - User registration with validation
  - User authentication (login/logout)
  - JWT token generation and validation
  - Protected route access
  - Database operations (CRUD)
  - Input validation enforcement
  - Authorization checks

### 3. Security Headers Tests (`npm run test:security`)
- **File**: `test/security-headers.test.js`
- **Purpose**: Verifies security middleware configuration
- **Checks**:
  - Content Security Policy (CSP)
  - X-Frame-Options (Clickjacking protection)
  - X-Content-Type-Options (MIME sniffing protection)
  - Referrer Policy
  - Cross-Origin Policies
  - HTTPS/TLS encryption
  - Server information hiding

### 4. Health Check Test (`npm run test:health`)
- **File**: `scripts/health-check.js`
- **Purpose**: Quick server availability check
- **Function**: Verifies basic API responsiveness

## 🚀 Running Tests

### All Tests (Recommended for CI/CD)
```bash
npm run test:all
```

### Individual Test Suites
```bash
npm test                    # Regex validation
npm run test:api           # API functionality  
npm run test:security      # Security headers
npm run test:health        # Health check
```

## ✅ Expected Test Results

All tests should pass with these indicators:

### Input Validation Tests
```
✅ All regex pattern tests passed!
✔ Regex patterns validation (4.6621ms)
ℹ tests 1, pass 1, fail 0
```

### API Functionality Tests
```
🎉 All Banking API Tests Completed Successfully!
📊 Test Summary:
   ✅ HTTPS/SSL: Working
   ✅ MongoDB Atlas: Connected  
   ✅ User Registration: Working
   ✅ User Login: Working
   ✅ JWT Authentication: Working
   ✅ Input Validation: Working
   ✅ Authorization: Working
   ✅ API Endpoints: All functional
```

### Security Headers Tests
```
🔒 Security Headers Test Results:
   ✅ Content Security Policy: [configured]
   ✅ Frame Options: DENY
   ✅ Content Type Options: nosniff
   ✅ Referrer Policy: same-origin
   ✅ Cross-Origin Policies: [configured]
📊 Additional Security Info:
   🔐 HTTPS: Yes
   📋 Status Code: 200
   🌐 Server: Hidden (Good!)
```

## 🔧 Test Configuration

### Prerequisites for Testing
- Banking API server must be running (`npm start` or `npm run dev`)
- MongoDB Atlas connection active
- SSL certificates configured (for HTTPS tests)
- Environment variables properly set

### Test Environment Setup
```bash
# 1. Start the API server
npm run dev

# 2. In another terminal, run tests
npm run test:all
```

## 🐛 Troubleshooting Tests

### Common Issues

#### SSL Certificate Warnings
```
(node:xxxx) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0'...
```
- **Cause**: Self-signed certificates in development
- **Solution**: This is expected and safe for development testing

#### Database Connection Errors
- **Check**: MongoDB Atlas connection string in `.env`
- **Verify**: Network access whitelist includes your IP
- **Confirm**: Database user credentials are correct

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3443
```
- **Solution**: Stop existing server or change port in `.env`

#### Test Timeout Issues
- **Cause**: Server not responding
- **Check**: Ensure API server is running before tests
- **Verify**: Health endpoint accessible at `https://localhost:3443/api/health`

## 📊 CI/CD Integration

### GitHub Actions (Future Implementation)
```yaml
name: Banking API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:all
```

### Pre-commit Hooks
Consider adding pre-commit hooks to run tests automatically:
```bash
npm install --save-dev husky
npx husky add .husky/pre-commit "npm run test:all"
```

## 🎯 Test Coverage Goals

- ✅ **Authentication**: Registration, login, JWT validation
- ✅ **Authorization**: Protected routes, role-based access  
- ✅ **Input Validation**: All regex patterns, malicious input blocking
- ✅ **Security**: Headers, HTTPS, data protection
- ✅ **Database**: CRUD operations, connection stability
- ✅ **Error Handling**: Proper HTTP status codes, error messages

## 📈 Future Test Enhancements

1. **Load Testing**: Performance under concurrent users
2. **Integration Testing**: Frontend-backend communication
3. **Security Testing**: Penetration testing, vulnerability scans
4. **Database Testing**: Data integrity, transaction rollbacks
5. **Deployment Testing**: Production environment validation

This comprehensive testing suite ensures your banking API is production-ready and secure for handling financial transactions.
