// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic security & parsers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// rate limiter
app.use(rateLimit({ windowMs: 1000 * 30, max: 250 }));

// serve uploads - resolve path relative to backend root, not src folder
const uploadsPath = process.env.UPLOAD_DIR 
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true, now: new Date() }));

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`Created uploads directory at: ${uploadsPath}`);
}

// connect mongo + start
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ Error: MONGO_URI not found in environment variables');
  console.error('Please create a .env file with MONGO_URI');
  process.exit(1);
}

mongoose.connect(mongoUri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(()=> {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, ()=> {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
      console.log(`📁 Uploads directory: ${uploadsPath}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => { 
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Please check:');
    console.error('  1. MONGO_URI in .env file is correct');
    console.error('  2. MongoDB connection string includes database name');
    console.error('  3. Network allows connection to MongoDB');
    process.exit(1); 
  });

