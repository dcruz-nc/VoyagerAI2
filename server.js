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
const vehicleRoutes = require('./routes/vehicleRoutes');
const vehicleData = require('./seed/vehicleData');
const Vehicle = require('./models/vehicle');
const { syncVehicles } = require('./services/vehicleService');
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
    await syncVehicles(vehicleData);
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
app.get('/', async (req, res, next) => {
  try {
    const featuredVehicles = await Vehicle.find({ isFeatured: true });
    res.render('index', { featuredVehicles });
  } catch (err) {
    next(err);
  }
})


app.use('/users', userRoutes);

app.use('/rentals', rentalRoutes);

app.use('/docs', docsRoutes);

app.use('/vehicles', vehicleRoutes);


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


// ✅ Start server only if run directly (not during testing)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  });
}

// ✅ Export app for testing
module.exports = app;