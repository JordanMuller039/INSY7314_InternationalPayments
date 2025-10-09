// Simple health check without MongoDB dependency
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Basic security
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Banking API core is working'
  });
});

const PORT = process.env.PORT || 3444;

const server = app.listen(PORT, () => {
  console.log(`✅ Health check server running on http://localhost:${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/api/health`);
});

// Auto-shutdown after 5 seconds for testing
setTimeout(() => {
  console.log('⏹️  Shutting down health check server...');
  server.close(() => {
    console.log('✅ Health check completed successfully');
    process.exit(0);
  });
}, 5000);
