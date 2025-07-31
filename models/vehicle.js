const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: { type: String, required: [true, 'Car make is required'] },             // e.g. Tesla
  model: { type: String, required: [true, 'Car model is required'] },           // e.g. Model 3
  year: { type: Number, required: [true, 'Manufacturing year is required'] },   // e.g. 2023
  type: { type: String, required: [true, 'Car type is required'] },             // e.g. Electric, SUV
  pricePerDay: { type: Number, required: [true, 'Rental price per day is required'] },
  imageUrl: { type: String, required: [true, 'Image URL is required'] },
  description: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Car', carSchema);
