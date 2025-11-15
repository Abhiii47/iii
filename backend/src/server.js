// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
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

// serve uploads
app.use('/uploads', express.static(path.resolve(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true, now: new Date() }));

// connect mongo + start
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
  })
  .catch(err => { console.error('Mongo connection failed', err); process.exit(1) });

