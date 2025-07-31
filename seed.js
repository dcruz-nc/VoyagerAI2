require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('./models/vehicle');

const mongUri = process.env.MONGO_URI;

const cars = [
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Electric',
    pricePerDay: 79,
    imageUrl: '/images/tesla.jpg',
    description: 'Smooth ride, fully electric, smart features.',
    isFeatured: true
  },
  {
    make: 'Toyota',
    model: 'RAV4',
    year: 2022,
    type: 'Hybrid',
    pricePerDay: 52,
    imageUrl: '/images/rav4.jpg',
    description: 'Reliable and efficient SUV.',
    isFeatured: true
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    type: 'Sport',
    pricePerDay: 89,
    imageUrl: '/images/mustang.jpg',
    description: 'Classic American muscle car.',
    isFeatured: true
  }
];

mongoose.connect(mongUri)
  .then(() => {
    console.log('MongoDB connected');
    return Car.deleteMany({}); // Clear existing data
  })
  .then(() => Car.insertMany(cars))
  .then(() => {
    console.log('Cars inserted');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
