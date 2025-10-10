# 🏦 Turtle Shell Banking - Complete Setup Guide

> **INSY7314 Task 2 - International Payments Portal**  
> Step-by-step guide to get the entire banking application running on your computer

## 📋 Table of Contents

1. [Prerequisites Installation](#-prerequisites-installation)
2. [Project Overview](#-project-overview)
3. [Initial Setup](#-initial-setup)
4. [Backend Setup](#-backend-setup)
5. [Frontend Setup](#-frontend-setup)
6. [Running the Application](#-running-the-application)
7. [Testing Everything Works](#-testing-everything-works)
8. [Troubleshooting](#-troubleshooting)
9. [Common Issues](#-common-issues)

---

## 🎯 Prerequisites Installation

**IMPORTANT**: Do these steps BEFORE anything else!

### Step 1: Install Node.js

1. Go to: https://nodejs.org/
2. Download the **LTS version** (the green button, should be 18.x or higher)
3. Run the installer
4. Keep clicking "Next" and accept all defaults
5. Click "Finish"

**Verify it worked:**
```bash
node --version
```
You should see something like `v18.17.0` or higher

```bash
npm --version
```
You should see something like `9.6.7` or higher

### Step 2: Install MongoDB

**Option A: MongoDB Community (Recommended)**

1. Go to: https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server for Windows
3. Run the installer
4. Choose "Complete" installation
5. **IMPORTANT**: Check "Install MongoDB as a Service"
6. **IMPORTANT**: Check "Install MongoDB Compass" (GUI tool)
7. Click "Install"

**Option B: Use MongoDB Atlas (Cloud - Easier)**

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a free cluster (M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (we'll use this later)

### Step 3: Install Git (if you haven't)

1. Go to: https://git-scm.com/download/win
2. Download and run installer
3. Accept all defaults
4. Click "Install"

**Verify it worked:**
```bash
git --version
```
You should see something like `git version 2.x.x`

### Step 4: Install a Code Editor (Optional but Recommended)

Download **VS Code**: https://code.visualstudio.com/

---

## 📁 Project Overview

```
PaymentPortal/
├── backend/              ← Node.js API Server
│   ├── controllers/      ← Business logic
│   ├── middleware/       ← Security & validation
│   ├── models/          ← Database schemas
│   ├── routes/          ← API endpoints
│   ├── keys/            ← SSL certificates
│   └── server.js        ← Main server file
├── frontend/            ← React Application
│   ├── src/
│   │   ├── components/  ← UI components
│   │   ├── pages/       ← Main pages
│   │   ├── services/    ← API calls
│   │   └── App.tsx      ← Main app
│   └── index.html
└── README.md            ← This file!
```

---

## 🚀 Initial Setup

### Step 1: Clone the Repository

Open **Command Prompt** or **PowerShell**:

```bash
# Navigate to where you want the project
cd Desktop

# Clone the repository
git clone [YOUR_REPO_URL_HERE]

# Go into the project folder
cd PaymentPortal
```

**What this does**: Downloads the entire project to your computer

### Step 2: Verify Project Structure

```bash
dir
```

You should see two main folders: `backend` and `frontend`

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

**This will take 2-5 minutes.** It downloads all the packages the backend needs.

You should see a bunch of text scrolling and eventually:
```
added 150 packages in 2m
```

### Step 3: Create Environment File

**Copy the example file:**

```bash
copy .env.example .env
```

**Edit the .env file:**

Open the file in Notepad:
```bash
notepad .env
```

**Replace with these settings:**

```env
# Server Configuration
PORT=3443
NODE_ENV=development

# Database - CHOOSE ONE:
# Option A: Local MongoDB
ATLAS_DB_PATH=mongodb://localhost:27017/banking_app

# Option B: MongoDB Atlas (if using cloud)
# ATLAS_DB_PATH=mongodb+srv://username:password@cluster.mongodb.net/banking_app

# JWT Secret - MUST GENERATE THIS!
JWT_SECRET=PASTE_YOUR_SECRET_HERE
JWT_EXPIRES_IN=24h

# Security
BCRYPT_ROUNDS=12

# CORS (Frontend URLs)
CORS_ALLOW_LIST=http://localhost:5173,https://localhost:5173,http://localhost:3000
```

### Step 4: Generate JWT Secret

**Run this command:**

```bash
node -p "require('crypto').randomBytes(64).toString('hex')"
```

You'll see a long random string like:
```
a3f5d8e9c2b1a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0
```

**COPY THIS ENTIRE STRING!**

Open `.env` again:
```bash
notepad .env
```

**Replace** `PASTE_YOUR_SECRET_HERE` with the string you copied:
```env
JWT_SECRET=a3f5d8e9c2b1a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0
```

Save and close.

### Step 5: Generate SSL Certificates

**Run this command:**

```bash
node scripts/generate-cert.js
```

You should see:
```
✅ SSL certificates generated successfully!
```

**What this does**: Creates security certificates so the app uses HTTPS (encrypted)

### Step 6: Test Backend

**Start the server:**

```bash
npm run dev
```

You should see:
```
🔐 Secure Banking API running on https://localhost:3443
📊 Health check: https://localhost:3443/api/health
🔒 HTTPS enabled with valid certificates
```

**Test it works:**

Open your browser and go to:
```
https://localhost:3443/api/health
```

You'll see a security warning (this is normal for development). Click:
- **Advanced** → **Proceed to localhost**

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-10-10T...",
  "environment": "development",
  "message": "Francois Smit - Banking API operational"
}
```

✅ **Backend is working!**

Press `Ctrl + C` to stop the server for now.

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend

**Open a NEW terminal window** (keep the first one open for later).

```bash
cd Desktop/PaymentPortal/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will take 3-5 minutes. You'll see:
```
added 500+ packages in 3m
```

### Step 3: Create Environment File

**Create the .env file:**

```bash
copy NUL .env
```

**Open it:**

```bash
notepad .env
```

**Paste this:**

```env
VITE_API_URL=https://localhost:3443/api
```

Save and close.

**What this does**: Tells the frontend where to find the backend API

### Step 4: Test Frontend (Quick Check)

**Start the development server:**

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   https://localhost:5173/
  ➜  Network: use --host to expose
```

**Open your browser:**
```
https://localhost:5173
```

Again, click through the security warning:
- **Advanced** → **Proceed to localhost**

You should see the **Turtle Shell Banking** landing page! 🎉

Press `Ctrl + C` to stop for now.

---

## 🚀 Running the Application

You need **TWO terminal windows** open - one for backend, one for frontend.

### Terminal 1: Backend

```bash
cd Desktop/PaymentPortal/backend
npm run dev
```

Wait for:
```
🔐 Secure Banking API running on https://localhost:3443
```

**LEAVE THIS RUNNING!**

### Terminal 2: Frontend

**Open a NEW terminal window**

```bash
cd Desktop/PaymentPortal/frontend
npm run dev
```

Wait for:
```
➜  Local:   https://localhost:5173/
```

**LEAVE THIS RUNNING!**

### Access the Application

Open your browser:
```
https://localhost:5173
```

✅ **The full application should now be running!**

---

## ✅ Testing Everything Works

### Test 1: Health Check

**Backend health:**
```
https://localhost:3443/api/health
```

Should return JSON with `"status": "OK"`

### Test 2: Register a New User

1. Go to: `https://localhost:5173`
2. Click **"Get Started"** or **"Sign Up"**
3. Fill in the registration form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `SecurePass123!`
   - ID Number: `1234567890123`
   - Account Number: `1234567890`
4. Click **"Register"**

You should be redirected to the dashboard!

### Test 3: Login

1. Log out if logged in
2. Click **"Login"**
3. Enter:
   - Email: `test@example.com`
   - Password: `SecurePass123!`
4. Click **"Login"**

You should see your dashboard with accounts!

### Test 4: Make a Payment

1. Navigate to **"Payments"** in the sidebar
2. Fill in the international payment form:
   - From Account: Select your account
   - To Account: `9876543210`
   - Amount: `100`
   - Currency: `USD`
   - SWIFT Code: `ABCDEF12`
   - Provider: `SWIFT`
3. Click **"Submit Payment"**

You should see a success message!

### Test 5: View Transactions

1. Click **"Transactions"** in the sidebar
2. You should see the payment you just made

✅ **Everything is working!**

---

## 🐛 Troubleshooting

### Issue 1: "Port 3443 is already in use"

**Cause**: Backend is still running from before

**Solution**:
```bash
# Find what's using the port
netstat -ano | findstr :3443

# You'll see a number at the end (PID)
# Kill that process:
taskkill /PID [number] /F
```

### Issue 2: "Cannot connect to MongoDB"

**Cause**: MongoDB isn't running

**Solution for Local MongoDB**:
```bash
# Check if MongoDB is running
sc query MongoDB

# If not, start it:
net start MongoDB
```

**Solution for MongoDB Atlas**:
- Check your connection string in `.env`
- Make sure your IP is whitelisted in Atlas
- Check username/password are correct

### Issue 3: "SSL Certificate Error"

**Cause**: Certificates weren't generated

**Solution**:
```bash
cd backend
npm run cert:openssl
```

### Issue 4: "CORS Error" in Browser Console

**Cause**: Frontend URL not whitelisted

**Solution**:

Open `backend/.env` and add:
```env
CORS_ALLOW_LIST=http://localhost:5173,https://localhost:5173,http://localhost:3000
```

Restart the backend server.

### Issue 5: Frontend Shows "Network Error"

**Cause**: Backend isn't running or wrong API URL

**Solution**:

1. Check backend is running on port 3443
2. Check `frontend/.env` has:
```env
VITE_API_URL=https://localhost:3443/api
```
3. Restart frontend

### Issue 6: "npm install" Fails

**Cause**: Old npm cache or network issues

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue 7: "Module not found" Errors

**Cause**: Dependencies not installed

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## 🔍 Common Issues

### "I get a blank page"

1. Check browser console (F12) for errors
2. Make sure backend is running
3. Check `frontend/.env` has correct API URL
4. Try hard refresh: `Ctrl + Shift + R`

### "Login doesn't work"

1. Check backend terminal for errors
2. Make sure MongoDB is running
3. Check JWT_SECRET is set in `backend/.env`
4. Try registering a new user first

### "Can't see any accounts"

1. Make sure you're logged in
2. Check Network tab (F12) for API errors
3. Verify backend is returning data:
   ```
   https://localhost:3443/api/accounts
   ```
   (Should show authentication error if not logged in)

### "Payment fails"

1. Check browser console for validation errors
2. Make sure account number exists
3. Check amount is positive
4. Verify SWIFT code format: 8 or 11 characters

---

## 📝 Quick Reference Commands

### Backend Commands
```bash
# Start backend
cd backend
npm run dev

# Generate SSL certificates
npm run cert:openssl

# Generate JWT secret
node -p "require('crypto').randomBytes(64).toString('hex')"

# Run tests
npm test
```

### Frontend Commands
```bash
# Start frontend
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Both (from root)
```bash
# Install all dependencies
npm install --prefix backend && npm install --prefix frontend

# Check if MongoDB is running (Windows)
sc query MongoDB

# Start MongoDB service (Windows)
net start MongoDB
```

---

## 🎓 For Assignment Submission

### What to Include:

1. **Screenshots**:
   - Backend running (terminal showing HTTPS)
   - Frontend running (browser showing landing page)
   - Login page
   - Dashboard
   - Payment page
   - Network tab showing HTTPS requests
   - SSL certificate details (click lock icon)

2. **Documentation**:
   - This README
   - List of security features implemented
   - Test results

3. **Code**:
   - GitHub repository link
   - Or ZIP file of entire project

### Security Features Checklist

Highlight these in your documentation:

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT authentication
- ✅ Input validation with RegEx patterns
- ✅ HTTPS/SSL encryption
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ HPP protection
- ✅ MongoDB injection prevention

---

## 💡 Tips for Success

1. **Always run backend FIRST, then frontend**
2. **Keep both terminals open while developing**
3. **Check terminal output for errors**
4. **Use browser DevTools (F12) to debug**
5. **Clear browser cache if things look weird**
6. **Read error messages carefully**
7. **Don't panic - most issues are simple fixes!**

---

## 🆘 Still Having Issues?

### Check These Files:

1. `backend/.env` - JWT_SECRET and database connection
2. `frontend/.env` - API URL
3. `backend/keys/` - Should have cert.pem and key.pem
4. MongoDB service is running

### Terminal Outputs Should Show:

**Backend:**
```
🔐 Secure Banking API running on https://localhost:3443
📊 Health check: https://localhost:3443/api/health
✅ Connected to MongoDB successfully!
```

**Frontend:**
```
VITE v5.x.x  ready in 500 ms
➜  Local:   https://localhost:5173/
```

### Browser Should Show:

- 🔒 Lock icon in address bar
- https:// in URL
- No CORS errors in console
- Successful API requests in Network tab

---

## 🎉 Success Criteria

You know everything is working when:

- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ You can register a new user
- ✅ You can login
- ✅ Dashboard shows accounts
- ✅ You can make a payment
- ✅ Transactions appear in history
- ✅ Browser shows HTTPS lock icon
- ✅ Network tab shows all requests to https://localhost:3443

---

## 📞 Team Contact

**Backend Developer**: Francois  
**Course**: INSY7314 Task 2  
**Project**: International Payments Portal  

---

## 📚 Additional Resources

- **Node.js Docs**: https://nodejs.org/docs/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express.js**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/

---

**Good luck with your setup! 🚀**

If you follow this guide step-by-step, you should have a fully working banking application. Remember: read error messages carefully, and most issues are just missing environment variables or services not running!