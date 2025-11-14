const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// storage for uploads (simple local storage)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'-'));
  }
});
const upload = multer({ storage });

// create listing (provider only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ message: 'Only providers can create listings' });
    const { title, address, lat, lng } = req.body;
    if (!title || !lat || !lng) return res.status(400).json({ message: 'title, lat, lng required' });
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const listing = new Listing({ title, address, lat: parseFloat(lat), lng: parseFloat(lng), imageUrl, owner: req.user._id });
    await listing.save();
    res.json(listing);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// list all (with optional bounding-box client-side filtering)
// For simplicity, return recent 200 listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }).limit(200).populate('owner', 'email name');
    res.json(listings);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
