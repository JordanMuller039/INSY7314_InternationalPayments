# Banking API Testing Guide - Francois Smit INSY7314

## Quick Test Execution

### Option 1: Automated Test Suite (Recommended)
```bash
# Run complete test suite
./run-tests.bat

# Or manually:
node server.js &
node test/complete-banking-test.js
```

### Option 2: Manual Testing with Postman/Browser

1. **Start the Server**
   ```bash
   node server.js
   ```
   Server will run on: `https://localhost:3443`

2. **Health Check**
   ```
   GET https://localhost:3443/api/health
   ```
   Expected: `200 OK` with system status

3. **User Registration**
   ```
   POST https://localhost:3443/api/auth/register
   Content-Type: application/json
   
   {
     "firstName": "Francois",
     "lastName": "Smit",
     "email": "francois.test@banking.com",
     "password": "SecurePass123!",
     "idNumber": "ID123456789",
     "accountNumber": "ACC987654321"
   }
   ```

4. **User Login**
   ```
   POST https://localhost:3443/api/auth/login
   Content-Type: application/json
   
   {
     "email": "francois.test@banking.com", 
     "password": "SecurePass123!"
   }
   ```
   Expected: JWT token in response

5. **International Payment**
   ```
   POST https://localhost:3443/api/payments/international
   Authorization: Bearer <JWT_TOKEN>
   Content-Type: application/json
   
   {
     "fromAccount": "ACC987654321",
     "toAccount": "INTL123456789", 
     "amount": 250.50,
     "currency": "USD",
     "recipientName": "John International",
     "recipientBank": "Example Bank",
     "swiftCode": "EXAMPLEGB2L",
     "description": "Test payment"
   }
   ```

6. **View Transactions**
   ```
   GET https://localhost:3443/api/transactions
   Authorization: Bearer <JWT_TOKEN>
   ```

## Test Results Validation

### ✅ Expected Successful Tests:
- Health Check (200 OK)
- User Registration (201 Created)
- User Login (200 OK with token)
- Authenticated Endpoints (200 OK)
- International Payment (201 Created)
- Payment History (200 OK)
- Security Headers (All present)
- Input Validation (400 Bad Request for invalid data)
- Unauthorized Access Protection (401 Unauthorized)

### 🔒 Security Features Validated:
- JWT Authentication
- Password Hashing (bcrypt)
- Input Validation (Regex patterns)
- Rate Limiting
- Security Headers (Helmet)
- HTTPS/SSL Support

## Troubleshooting

### Server Won't Start:
```bash
# Check if port is in use
netstat -ano | findstr :3443

# Kill existing processes
taskkill /F /PID <PID>
```

### SSL Certificate Issues:
- Browser will show security warning for self-signed certificates
- Click "Advanced" → "Proceed to localhost" 
- Or use test script which bypasses SSL verification

### Database Connection:
- Ensure MongoDB Atlas connection string is correct in .env
- Check internet connection for MongoDB Atlas access

## Performance Metrics

Expected response times:
- Health Check: < 50ms
- Authentication: < 200ms  
- Database Operations: < 500ms
- International Payments: < 1000ms

## Production Deployment Checklist

Before going live:
- [ ] Replace self-signed certificates with proper SSL
- [ ] Update CORS origins for production frontend
- [ ] Set strong JWT secret (64+ characters)
- [ ] Configure production MongoDB cluster
- [ ] Enable rate limiting for production load
- [ ] Set up monitoring and logging
- [ ] Review and update security headers
