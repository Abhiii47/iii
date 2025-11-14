const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  listingTitle: { type: String },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fromDate: { type: String },
  toDate: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending','accepted','declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
