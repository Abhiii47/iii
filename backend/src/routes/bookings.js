const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// create booking (user)
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, fromDate, toDate, message } = req.body;
    if (!listingId) return res.status(400).json({ message: 'listingId required' });
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    const booking = new Booking({
      listingId: listing._id,
      listingTitle: listing.title,
      providerId: listing.owner,
      userId: req.user._id,
      fromDate, toDate, message
    });
    await booking.save();

    // Optional email notify provider if SMTP configured
    if (process.env.SMTP_HOST) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        const provider = await (await require('../models/User').findById(listing.owner));
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: provider.email,
          subject: `New booking request for ${listing.title}`,
          text: `You have a new booking request from ${req.user.email || req.user._id}\nFrom: ${fromDate} To: ${toDate}\nMessage: ${message}`
        };
        transporter.sendMail(mailOptions).catch(e => console.error('Mail error', e));
      } catch (e) { console.error('Notify email error', e); }
    }

    res.json(booking);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// provider: list bookings where providerId == me
router.get('/provider', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ message: 'Only providers' });
    const bookings = await Booking.find({ providerId: req.user._id }).sort({ createdAt: -1 }).limit(200);
    res.json(bookings);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// user: list my bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(200);
    res.json(bookings);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// provider update status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ message: 'Only providers' });
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted','declined','pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.providerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your booking' });
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
