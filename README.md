# 🏦 Turtle Shell Banking - International Payments Portal

> **INSY7314 Task 2 - Secure Banking Application**  
> A full-stack banking application with enterprise-grade security features for international payment processing

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4+-000000?logo=express&logoColor=white)](https://expressjs.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Security Implementation](#-security-implementation)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Overview

Turtle Shell Banking is a secure, full-stack banking application designed for international payment processing. Built with modern web technologies and enterprise-grade security practices, this application demonstrates comprehensive implementation of secure software development principles including password security, input validation, SSL/TLS encryption, and protection against common web vulnerabilities.

### Key Highlights

- 🔒 **Bank-Grade Security**: Implements multiple layers of security including encryption, authentication, and input validation
- 🌍 **International Payments**: SWIFT-based international payment processing with real-time validation
- 📊 **Transaction Management**: Complete transaction history with filtering and detailed analytics
- 🎨 **Modern UI/UX**: Responsive React interface with smooth animations and intuitive navigation
- 🔐 **HTTPS Everywhere**: All traffic encrypted with SSL/TLS certificates
- 🛡️ **Attack Protection**: Rate limiting, CORS, helmet security headers, and input sanitization

---

## ✨ Features

### User Management
- Secure user registration with comprehensive validation
- JWT-based authentication with token expiration
- Password hashing using bcrypt (12 salt rounds)
- User profile management
- Password change functionality

### Account Management
- Multiple account support per user
- Real-time balance tracking
- Account creation and deactivation
- Account-specific transaction history
- ZAR (South African Rand) currency support

### International Payments
- SWIFT code validation
- Multi-currency support (USD, EUR, GBP, ZAR)
- Payment provider selection (SWIFT/Local)
- Real-time payment processing
- Payment status tracking (Pending, Completed, Failed)
- Payment cancellation for pending transactions

### Transaction History
- Complete transaction audit trail
- Transaction filtering and search
- Detailed transaction information
- Export capabilities (future enhancement)

### Security Features
- Password complexity requirements
- Input whitelisting with RegEx patterns
- Rate limiting on sensitive endpoints
- HTTPS/SSL encryption
- CORS protection
- Helmet security headers
- MongoDB injection prevention
- Session management
- XSS protection

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI Framework |
| TypeScript | 5+ | Type Safety |
| Vite | 5+ | Build Tool |
| TailwindCSS | 3+ | Styling |
| React Router | 6+ | Navigation |
| Lucide React | Latest | Icons |
| Axios | Latest | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4+ | Web Framework |
| MongoDB | 6+ | Database |
| Mongoose | Latest | ODM |
| JWT | Latest | Authentication |
| bcryptjs | Latest | Password Hashing |
| Helmet | Latest | Security Headers |
| Express Validator | Latest | Input Validation |
| Express Rate Limit | Latest | Rate Limiting |
| CORS | Latest | Cross-Origin Control |

### Security Tools
- OpenSSL for SSL certificate generation
- bcryptjs for password hashing
- Helmet for security headers
- express-validator for input validation
- hpp for HTTP Parameter Pollution prevention

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (React SPA - https://localhost:5173)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Services │  │  Context │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └─────────────┼─────────────┼─────────────┘          │
└───────────────────────┼─────────────┼────────────────────────┘
                        │             │
                    HTTPS/SSL (TLS 1.2+)
                        │             │
┌───────────────────────┼─────────────┼────────────────────────┐
│                   API Layer                                   │
│         (Express REST API - https://localhost:3443)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │→ │Middleware│→ │Controller│→ │  Models  │   │
│  └──────────┘  └──────────┘  └──────────┘  └────┬─────┘   │
│   • Auth       • Validation  • Business      │              │
│   • Accounts   • Auth Check  • Logic         │              │
│   • Payments   • Rate Limit                  │              │
│   • Transactions                              │              │
└─────────────────────────────────────────────────┼────────────┘
                                                  │
┌─────────────────────────────────────────────────┼────────────┐
│                    Database Layer                             │
│              (MongoDB - Atlas/Local)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Users   │  │ Accounts │  │Transactions│                 │
│  └──────────┘  └──────────┘  └──────────┘                  │
└───────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client Request**: User interacts with React UI
2. **HTTPS Transport**: Request encrypted via SSL/TLS
3. **API Gateway**: Express receives and logs request
4. **Middleware Chain**:
   - CORS validation
   - Rate limiting check
   - Input validation
   - JWT authentication
5. **Controller**: Business logic execution
6. **Database**: MongoDB query/mutation
7. **Response**: JSON response encrypted back to client

---

## 🔒 Security Implementation

### 1. Password Security (Hashing & Salting)

**Implementation**: bcrypt with 12 salt rounds

```javascript
// Password hashing on registration
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);

// Password verification on login
const isMatch = await bcrypt.compare(password, user.password);
```

**Features**:
- Configurable salt rounds (default: 12)
- One-way hashing (irreversible)
- Unique salt per password
- Password complexity requirements enforced

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

### 2. Input Whitelisting (RegEx Patterns)

**Implementation**: express-validator with custom RegEx patterns

**Validation Patterns**:

| Field | Pattern | Description |
|-------|---------|-------------|
| Names | `/^[a-zA-Z\s'-]{2,50}$/` | Letters, spaces, hyphens, apostrophes |
| Email | Standard RFC 5322 | Email validation |
| Account Number | `/^\d{8,20}$/` | 8-20 digits only |
| SWIFT Code | `/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/` | 8 or 11 character SWIFT format |
| Currency | `/^[A-Z]{3}$/` | ISO 4217 currency codes |
| Amount | `/^\d{1,13}(\.\d{1,2})?$/` | Max 15 digits, 2 decimals |
| ID Number | `/^\d{13}$/` | South African ID format |

**Example Validation**:

```javascript
const validatePayment = [
  body('amount')
    .matches(/^\d{1,13}(\.\d{1,2})?$/)
    .withMessage('Invalid amount format'),
  body('swift')
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
    .withMessage('Invalid SWIFT code format')
];
```

---

### 3. SSL/TLS Encryption (Data in Transit)

**Implementation**: HTTPS with self-signed certificates for development

**Certificate Details**:
- Algorithm: RSA 2048-bit
- Validity: 365 days
- Subject: CN=localhost
- Subject Alternative Names: localhost, 127.0.0.1

**Backend Configuration**:
```javascript
const options = {
  key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem'))
};
const server = https.createServer(options, app);
```

**Frontend Configuration**:
```typescript
// Vite HTTPS configuration
server: {
  https: {
    key: fs.readFileSync('../backend/keys/key.pem'),
    cert: fs.readFileSync('../backend/keys/cert.pem')
  }
}
```

**Benefits**:
- All data encrypted in transit
- Man-in-the-middle attack prevention
- Browser security indicators
- Secure cookie transmission

---

### 4. Protection Against Attacks

**Rate Limiting**:
```javascript
// Authentication endpoints: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts'
});

// Payment endpoints: 10 requests per 15 minutes
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many payment requests'
});

// General API: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

**Helmet Security Headers**:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**CORS Protection**:
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ALLOW_LIST.split(',');
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
```

**Additional Protections**:
- HPP (HTTP Parameter Pollution) prevention
- MongoDB injection prevention via Mongoose sanitization
- XSS protection via input validation and output encoding
- CSRF protection via JWT tokens
- SQL Injection: N/A (using NoSQL)

---

### 5. DevSecOps Pipeline

**Current Implementation**:
- Git version control with GitHub
- Environment-based configuration (.env files)
- Automated certificate generation scripts
- Comprehensive test suites

**Planned Enhancements** (Task 3):
- GitHub Actions CI/CD pipeline
- Automated security scanning (npm audit, Snyk)
- SAST (Static Application Security Testing)
- Dependency vulnerability checking
- Automated testing in pipeline
- Docker containerization
- Cloud deployment automation

---

## 📁 Project Structure

```
PaymentPortal/
├── backend/                      # Node.js Express API
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── accountController.js # Account management
│   │   ├── paymentController.js # Payment processing
│   │   └── transactionController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── validation.js        # Input validation
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Account.js           # Account schema
│   │   └── Transaction.js       # Transaction schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── accounts.js          # Account endpoints
│   │   ├── payments.js          # Payment endpoints
│   │   └── transactions.js      # Transaction endpoints
│   ├── scripts/
│   │   └── generate-cert.js     # SSL cert generation
│   ├── utils/
│   │   └── regex.js             # Validation patterns
│   ├── keys/                    # SSL certificates
│   ├── tests/                   # Test suites
│   ├── .env.example             # Environment template
│   ├── app.js                   # Express app setup
│   ├── server.js                # Server entry point
│   └── package.json
│
├── frontend/                     # React TypeScript Application
│   ├── public/
│   │   └── assets/              # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Auth components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── layout/          # Layout components
│   │   │   └── ui/              # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Landing.tsx      # Landing page
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration page
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── Accounts.tsx     # Account management
│   │   │   ├── Payments.tsx     # Payment interface
│   │   │   └── Transactions.tsx # Transaction history
│   │   ├── services/
│   │   │   └── api.ts           # API client
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Auth state management
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── .env.example             # Environment template
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── package.json
│
├── docs/                         # Documentation
│   ├── API.md                   # API documentation
│   ├── SETUP.md                 # Detailed setup guide
│   └── SECURITY.md              # Security documentation
│
├── .gitignore
├── README.md                    # This file
└── LICENSE
```

---

## 📦 Prerequisites

### Required Software

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **MongoDB**: Version 6.x or higher (local) OR MongoDB Atlas account (cloud)
- **Git**: Latest version
- **OpenSSL**: For certificate generation (usually pre-installed on macOS/Linux)

### System Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB, recommended 8GB
- **Disk Space**: Minimum 500MB free space
- **Browser**: Modern browser with JavaScript enabled (Chrome, Firefox, Safari, Edge)

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/PaymentPortal.git
cd PaymentPortal
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
node scripts/generate-cert.js
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

### 4. Access Application

- **Frontend**: https://localhost:5173
- **Backend API**: https://localhost:3443
- **Health Check**: https://localhost:3443/api/health

**Note**: Accept the self-signed certificate warning in your browser.

For detailed setup instructions, see [SETUP.md](./docs/SETUP.md)

---

## 📖 API Documentation

### Base URL

```
https://localhost:3443/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints Overview

#### Authentication
```http
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile (Protected)
PUT  /api/auth/profile     # Update profile (Protected)
PUT  /api/auth/password    # Change password (Protected)
```

#### Accounts
```http
GET    /api/accounts                        # Get user accounts (Protected)
POST   /api/accounts                        # Create account (Protected)
GET    /api/accounts/:accountNumber         # Get account details (Protected)
GET    /api/accounts/:accountNumber/balance # Get balance (Protected)
DELETE /api/accounts/:accountNumber         # Deactivate account (Protected)
```

#### Payments
```http
POST   /api/payments/international          # Create payment (Protected)
GET    /api/payments                        # Get payment history (Protected)
GET    /api/payments/:transactionId         # Get payment details (Protected)
DELETE /api/payments/:transactionId         # Cancel payment (Protected)
```

#### Transactions
```http
GET /api/transactions              # Get user transactions (Protected)
GET /api/transactions/:id          # Get transaction details (Protected)
```

### Example Request

```bash
# Register User
curl -X POST https://localhost:3443/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "idNumber": "1234567890123",
    "accountNumber": "1234567890"
  }'

# Login
curl -X POST https://localhost:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Make Payment (requires token)
curl -X POST https://localhost:3443/api/payments/international \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fromAccount": "1234567890",
    "toAccount": "9876543210",
    "amount": 100.00,
    "currency": "USD",
    "swift": "ABCDEF12",
    "provider": "SWIFT"
  }'
```

For complete API documentation, see [API.md](./docs/API.md)

---

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Suites

**Backend**:
- Unit tests for controllers
- Integration tests for API endpoints
- Security tests for validation
- Authentication tests

**Frontend**:
- Component unit tests
- Integration tests
- E2E tests (future enhancement)

### Manual Testing

1. **Health Check**: Verify backend is running
   ```
   GET https://localhost:3443/api/health
   ```

2. **User Registration**: Test registration flow with valid/invalid data

3. **Authentication**: Test login with correct/incorrect credentials

4. **Account Management**: Create, view, and deactivate accounts

5. **Payment Processing**: Submit international payments with validation

6. **Transaction History**: View and filter transactions


## 👥 Team

**Course**: INSY7314 - Information Systems Security  
**Institution**: [Your University Name]  
**Assignment**: Task 2 - Secure Software Development  

**Team Members**:
- **Backend Developer**: Francois Smit
- **Frontend Developer**: [Team Member Name]
- **Security Lead**: [Team Member Name]
- **QA Tester**: [Team Member Name]

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

**Educational Use Only**: This project is developed for academic purposes as part of the INSY7314 coursework.

---

## 🙏 Acknowledgments

- University lecturers and course instructors
- Open-source community for excellent libraries and tools
- MongoDB Atlas for free-tier database hosting
- Anthropic Claude for development assistance

---

## 🤖 AI Acknowledgements

This project was developed with assistance from various AI tools for learning, understanding best practices, and implementation guidance:

### AI Tools Used

**GitHub Copilot**
- Code completion and suggestions
- Boilerplate generation
- Debugging assistance

**Claude (Anthropic)**
- Security implementation guidance and best practices
- Architecture design decisions
- Tech stack recommendations
- React and TypeScript setup assistance
- Code review and optimization suggestions
- Documentation structuring

**ChatGPT (OpenAI)**
- Understanding security concepts and approaches
- Research on authentication patterns
- Best practices for password hashing and encryption
- Learning React ecosystem and modern web development

### Usage Context

AI tools were utilized for:
- **Learning**: Understanding security principles, JWT authentication, bcrypt hashing, SSL/TLS implementation
- **Architecture**: Deciding on appropriate tech stack and project structure
- **Development**: Setting up React with TypeScript, configuring Vite, implementing Express middleware
- **Problem Solving**: Debugging CORS issues, SSL certificate generation, MongoDB connection setup
- **Best Practices**: Input validation patterns, rate limiting strategies, security headers configuration
- **Documentation**: Structuring README files, API documentation, and code comments

### Development Approach

While AI tools provided valuable guidance and suggestions, all code was:
- Reviewed and understood by the development team
- Tested thoroughly for functionality and security
- Adapted to meet specific project requirements
- Validated against course learning objectives
- Integrated with careful consideration of security implications

**Note**: The use of AI tools enhanced our learning experience and productivity while ensuring we understood the underlying concepts and security principles being implemented.

---

## 📞 Contact & Support

For questions, issues, or contributions:

- **GitHub Issues**: [Repository Issues](https://github.com/yourusername/PaymentPortal/issues)
- **Email**: student@university.edu
- **Documentation**: See `/docs` folder for detailed guides

---
