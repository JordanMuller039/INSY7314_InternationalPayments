# TEAM SETUP GUIDE - INSY7314 International Payments

## 🚀 Quick Start for Team Members

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Francois05112002/INSY7314_InternationalPayments.git
cd INSY7314_InternationalPayments
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# Ask team lead for MongoDB connection string
```

### 4. Start Backend
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Test API
- **Health Check**: https://localhost:3443/api/health
- **Accept SSL Certificate**: Click "Advanced" → "Proceed to localhost" in browser

## 🎯 Frontend Development

### API Base URL
```
DEVELOPMENT: https://localhost:3443
PRODUCTION: [TBD - Will be deployed URL]
```

### Authentication Example
```javascript
// 1. Login to get token
const login = async (email, password) => {
  const response = await fetch('https://localhost:3443/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// 2. Use token for authenticated requests
const getAccounts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('https://localhost:3443/api/accounts', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

## 📱 Project Structure for Frontend Team

```
BACKEND (This Repository)
├── controllers/     → API business logic
├── routes/         → API endpoints  
├── models/         → Database schemas
├── middleware/     → Security & validation
└── README.md       → Full API documentation

FRONTEND (Your Work)
├── src/
│   ├── components/ → React/Vue components
│   ├── services/   → API calls to backend
│   ├── pages/      → Banking app screens
│   └── utils/      → Helper functions
└── package.json
```

## 🔑 Required Environment Variables

Ask team lead for these values:
```bash
ATLAS_DB_PATH=mongodb+srv://...     # MongoDB connection
JWT_SECRET=...                      # JWT signing secret
PORT=3443                          # API port
```

## 📞 Team Communication

- **Backend Issues**: Contact Francois
- **API Questions**: Check README.md API documentation
- **Environment Setup**: See MONGODB_SETUP.md
- **SSL Issues**: See SSL_SETUP.md

## ✅ Team Checklist

**Backend Team (Francois):**
- [x] MongoDB Atlas setup
- [x] JWT authentication
- [x] Input validation & security
- [x] HTTPS/SSL certificates
- [x] API documentation
- [x] CORS configuration
- [ ] Deploy to production

**Frontend Team:**
- [ ] Clone repository
- [ ] Setup development environment
- [ ] Create login/register pages
- [ ] Create account dashboard
- [ ] Create payment forms
- [ ] Integrate with backend API
- [ ] Handle authentication flow
- [ ] Test with backend

## 🚨 Important Notes

1. **Never commit .env files** - They contain secrets!
2. **Always use HTTPS** - API runs on port 3443 with SSL
3. **Include JWT tokens** - All protected routes need Authorization header
4. **Handle errors** - API returns consistent error format
5. **Test locally first** - Use https://localhost:3443 for development

## 📋 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| GET | `/api/accounts` | Get user accounts | Yes |
| GET | `/api/accounts/:id/balance` | Get account balance | Yes |
| POST | `/api/payments/international` | Create payment | Yes |
| GET | `/api/payments` | Payment history | Yes |

**Full API documentation available in README.md**
