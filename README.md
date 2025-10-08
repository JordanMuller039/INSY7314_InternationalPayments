# INSY7314 International Payments Portal - Backend API

> **Secure Banking API for International Payment Processing**  
> A production-ready Node.js Express API with MongoDB Atlas, JWT authentication, and comprehensive security features.

## 👥 Team Project - INSY7314 Task 2

**Backend Developer**: Francois  
**Frontend Team**: Ready for integration  
**Course**: INSY7314 - Information Systems Security  
**Institution**: University Assignment

## 🏦 Overview

This banking backend API provides secure authentication, account management, and international payment processing capabilities. Built with security-first principles including JWT authentication, input validation, rate limiting, and HTTPS support.

### 🛠️ Tech Stack

- **Node.js** (18+) - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Express Rate Limit** - DoS protection

### 🔒 Security Features

- **Strong Authentication**: JWT tokens with configurable expiration
- **Password Security**: bcrypt hashing with configurable rounds (default: 12)
- **Input Validation**: Comprehensive regex-based whitelisting
- **Rate Limiting**: Configurable limits on auth and payment endpoints
- **Security Headers**: Helmet middleware with CSP, frameguard, etc.
- **HTTPS Support**: Self-signed certificates for development
- **CORS Protection**: Configurable origin allowlist
- **HPP Protection**: HTTP Parameter Pollution prevention

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm 8+
- **MongoDB** (local or Atlas)
- **OpenSSL** (for HTTPS certificates)

### Installation

```bash
# Clone or download project
cd PaymentPortal

# Install dependencies
npm install

# Copy environment template
copy .env.example .env

# Edit .env with your configuration
notepad .env
```

### Configuration

Edit `.env` file with your settings:

```env
# Database
ATLAS_DB_PATH=mongodb://localhost:27017/banking_app

# JWT Secret (generate with: node -p "require('crypto').randomBytes(64).toString('hex')")
JWT_SECRET=your-very-long-random-secret-here

# Server
PORT=3443
NODE_ENV=development
```

### Generate JWT Secret

```bash
node -p "require('crypto').randomBytes(64).toString('hex')"
```

### Start Development Server

```bash
# Generate SSL certificates (optional, for HTTPS)
npm run cert:openssl

# Start server in development mode
npm run dev

# Or start without nodemon
npm start
```

### Access Points

- **API Base**: `http://localhost:3443` (or `https://localhost:3443` with certs)
- **Health Check**: `/api/health`
- **API Documentation**: Available through endpoint testing

---

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update profile | Private |
| PUT | `/password` | Change password | Private |

### Accounts (`/api/accounts`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user accounts | Private |
| POST | `/` | Create new account | Private |
| GET | `/:accountNumber` | Get account details | Private |
| GET | `/:accountNumber/balance` | Get account balance | Private |
| GET | `/:accountNumber/transactions` | Get account transactions | Private |
| DELETE | `/:accountNumber` | Deactivate account | Private |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/international` | Create international payment | Private |
| GET | `/` | Get payment history | Private |
| GET | `/:transactionId` | Get payment details | Private |
| DELETE | `/:transactionId` | Cancel pending payment | Private |
| PUT | `/:transactionId/process` | Process payment | Admin/Employee |

### Transactions (`/api/transactions`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user transactions | Private |
| GET | `/all` | Get all transactions | Admin |
| GET | `/:transactionId` | Get transaction details | Private |

---

## 🧪 Testing

### Manual Testing

```bash
# Health check
curl http://localhost:3443/api/health

# Register user
curl -X POST http://localhost:3443/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "idNumber": "ID123456789",
    "accountNumber": "1234567890"
  }'

# Login
curl -X POST http://localhost:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Run Tests

```bash
# Run all tests
npm run test:all

# Individual test suites
npm test                    # Regex validation tests
npm run test:api           # Comprehensive API functionality tests
npm run test:security      # Security headers and HTTPS tests
npm run test:health        # Quick health check
```

---

## 📁 Project Structure

```
PaymentPortal/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── accountController.js
│   └── paymentController.js
├── middleware/           # Custom middleware
│   ├── auth.js
│   └── validation.js
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Account.js
│   └── Transaction.js
├── routes/              # API routes
│   ├── auth.js
│   ├── accounts.js
│   ├── payments.js
│   └── transactions.js
├── utils/               # Utilities
│   └── regex.js
├── config/              # Configuration
│   └── database.js
├── keys/                # SSL certificates
│   └── .gitkeep
├── scripts/             # Helper scripts
│   └── generate-cert.js
├── app.js               # Express app setup
├── server.js            # Server entry point
└── .env.example         # Environment template
```

---

## 🔐 Security Implementation

### Input Validation Patterns

- **Names**: Letters, spaces, hyphens, apostrophes (2-50 chars)
- **Email**: Standard email validation
- **Account Numbers**: 8-20 digits
- **Currency**: ISO 4217 codes (3 uppercase letters)
- **Amounts**: Up to 2 decimal places, max 15 digits
- **SWIFT Codes**: 8 or 11 character format

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Payments**: 10 requests per 15 minutes

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change `PORT` in `.env` or kill process: `netstat -ano \| findstr :3443` |
| MongoDB connection | Check `ATLAS_DB_PATH` in `.env` and MongoDB service |
| SSL certificate errors | Run `npm run cert:openssl` or use HTTP mode |
| JWT errors | Generate new `JWT_SECRET` with crypto.randomBytes |
| CORS errors | Add frontend URL to `CORS_ALLOW_LIST` |

---

## 🔄 Development Workflow

1. **Setup**: Copy `.env.example` to `.env` and configure
2. **Database**: Ensure MongoDB is running
3. **Certificates**: Generate with `npm run cert:openssl` (optional)
4. **Development**: Run `npm run dev` for hot reload
5. **Testing**: Use Postman/curl for API testing
6. **Linting**: Run `npm run lint` before commits

---

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3443 |
| `NODE_ENV` | Environment | No | development |
| `ATLAS_DB_PATH` | MongoDB URI | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | Token expiration | No | 24h |
| `BCRYPT_ROUNDS` | Hashing rounds | No | 12 |
| `CORS_ALLOW_LIST` | Allowed origins | No | localhost |

---

## 🏗️ Next Steps (Task 3)

- [ ] **CI/CD Pipeline**: GitHub Actions workflow
- [ ] **Containerization**: Docker setup
- [ ] **Deployment**: Cloud platform integration
- [ ] **Monitoring**: Logging and health checks
- [ ] **Documentation**: API documentation generator
- [ ] **Testing**: Comprehensive test suite

---

## 👥 Team

- **Developer**: Banking App Team
- **Course**: INSY7314 Task 2
- **Focus**: Secure backend development

---

## 👨‍💻 Frontend Integration Guide

### For Frontend Developers:

#### **API Base URL**: `https://localhost:3443`

#### **Required Headers**:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>' // For protected routes
}
```

#### **Authentication Flow**:
1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns JWT token
3. **Use Token**: Include in Authorization header for protected routes

#### **Key Endpoints for Frontend**:
```javascript
// Authentication
POST /api/auth/register    // User registration
POST /api/auth/login       // User login
GET  /api/auth/profile     // Get user data

// Account Management  
GET  /api/accounts         // Get user accounts
GET  /api/accounts/:accountNumber/balance  // Get balance

// International Payments
POST /api/payments/international  // Create payment
GET  /api/payments         // Payment history
```

#### **Sample Frontend Usage**:
```javascript
// Login request
const response = await fetch('https://localhost:3443/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();

// Authenticated request
const accounts = await fetch('https://localhost:3443/api/accounts', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

#### **CORS Setup**: 
Frontend URLs already whitelisted in backend for:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)

---

## 📄 License

ISC License - Educational use for university coursework.
