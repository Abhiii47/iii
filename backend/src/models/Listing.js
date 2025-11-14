const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: { type: String, required: true },
  address: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);
