require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const path = require('path');
const axios = require('axios');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const docsRoutes = require('./routes/docsRoutes');
const { toTitleCase } = require('./utils/stringUtils');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.toTitleCase = toTitleCase;

// MongoDB connection URI from environment variable
const mongUri = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();  // <-- Call the connection function here

// mount middleware
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: mongUri }),        
        cookie: {maxAge: 60*60*1000}
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(methodOverride('_method'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));



//set up routes
app.get('/', (req, res) => {
    res.render('index');
})

app.use('/users', userRoutes);

app.use('/rentals', rentalRoutes);

app.use('/docs', docsRoutes);


app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = 'Internal Server Error';
    }
    res.status(err.status);
    res.render('error', {error: err});
})

const carData = [
  {
    name: 'Tesla Model 3',
    type: 'Electric',
    seats: 5,
    mpg: '130 MPGe',
    price: '$79/day',
    summary: 'Electric • 2023 • Autopilot — high-tech and eco-friendly for a smooth modern ride.'
  },
  {
    name: 'Toyota RAV4',
    type: 'Hybrid',
    seats: 5,
    mpg: 40,
    price: '$52/day',
    summary: 'Hybrid — practical and fuel-efficient with versatile utility.'
  },
  {
    name: 'Ford Mustang',
    type: 'Sport',
    seats: 4,
    mpg: 25,
    price: '$89/day',
    summary: 'Sport • Iconic performance and bold style — made for fun driving.'
  },
  {
    name: 'Honda Civic Sport',
    type: 'Gas',
    seats: 5,
    mpg: 32,
    price: '$45/day',
    summary: '2021 • Bluetooth • Rear Cam — compact, tech-equipped, and reliable.'
  },
  {
    name: 'Jeep Wrangler',
    type: '4x4',
    seats: 5,
    mpg: 20,
    price: '$72/day',
    summary: '2022 • Off-Road Ready — rugged and built for adventure.'
  }
];


// ✅ Start server only if run directly (not during testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

// ✅ Export app for testing
module.exports = app;