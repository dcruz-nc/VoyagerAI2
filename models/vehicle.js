const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  vin: { type: String, required: true, unique: true },
  make: { type: String, required: [true, 'Car make is required'] },
  model: { type: String, required: [true, 'Car model is required'] },
  year: { type: Number, required: [true, 'Manufacturing year is required'] },
  type: { type: String, required: [true, 'Car type is required'] },
  pricePerDay: { type: Number, required: [true, 'Rental price per day is required'] },
  imageUrl: { type: String, required: [true, 'Image URL is required'] },
  description: { type: String, default: '' },
  seats: { type: Number, required: [true, 'Number of seats is required'] },
  mpg: { type: String, required: [true, 'MPG is required'] },
  isFeatured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Vehicle', vehicleSchema);
