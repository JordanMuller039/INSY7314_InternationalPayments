// Banking API Application Setup - Francois Smit
// INSY7314 Task 2 - Secure Banking Backend Implementation

const express = require('express');
const helmet = require('helmet'); // Security headers - learned about this in lectures on web security
const cors = require('cors'); // Cross-origin requests for frontend integration
const rateLimit = require('express-rate-limit'); // DoS protection - important for banking apps
const hpp = require('hpp'); // HTTP Parameter Pollution attacks prevention
const connectDB = require('./config/database');

require('dotenv').config();

const app = express();

// Environment validation - critical security check I implemented
// Banking apps must never run with weak JWT secrets - this prevents production accidents
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters long');
  process.exit(1); // Fail fast approach - better than running insecurely
}

// Database connection initialization
connectDB();

// SECURITY LAYER 1: Helmet middleware configuration
// After researching banking security standards, I implemented comprehensive headers:
app.use(helmet({
  contentSecurityPolicy: {
    // CSP prevents XSS attacks - only allow resources from same origin
    directives: {
      defaultSrc: ["'self'"], // Only load scripts/styles from our domain
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline CSS for flexibility  
      scriptSrc: ["'self'"], // Block external JavaScript injection
      imgSrc: ["'self'", "data:", "https:"], // Allow secure image sources
    },
  },
  frameguard: { action: 'deny' }, // Prevent clickjacking attacks on banking interface
  noSniff: true, // Stop browsers from guessing file types (MIME confusion attacks)
  referrerPolicy: { policy: 'same-origin' } // Don't leak URLs to external sites
}));

// SECURITY LAYER 3: HTTP Parameter Pollution protection
// Prevents attackers from sending duplicate parameters to confuse server
app.use(hpp());

// SECURITY LAYER 4: CORS configuration for banking security
// Cross-Origin Resource Sharing - controls which websites can access our banking API
const corsOptions = {
  // Only allow requests from approved frontend domains (prevents malicious sites accessing user accounts)
  origin: process.env.CORS_ALLOW_LIST ? process.env.CORS_ALLOW_LIST.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true, // Allow authentication cookies/headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Only allow necessary headers
};
app.use(cors(corsOptions));

// SECURITY LAYER 5: Rate limiting (critical for banking APIs)
// Prevents brute force attacks on login and payment endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window
  max: 100, // Allow max 100 requests per IP per window (reasonable for banking operations)
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Don't use deprecated X-RateLimit headers
});
app.use(limiter);

// Request parsing with security limits
// Limit payload size to prevent DoS attacks through large request bodies
app.use(express.json({ limit: '10mb' })); // JSON payload limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Form data limit

// Health monitoring endpoint for system status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Francois Smit - Banking API operational'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/payments', require('./routes/payments'));

// 404 Error handling for invalid API endpoints
app.use((req, res) => {
  res.status(404).json({
    error: 'Banking API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Final error handler - captures all unhandled errors
app.use((err, req, res, next) => {
  console.error('Banking API Error:', err.message);
  
  // Security principle: Never expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Banking service temporarily unavailable',
    ...(isDevelopment && { stack: err.stack }) // Only show stack trace in dev mode
  });
});

module.exports = app;
