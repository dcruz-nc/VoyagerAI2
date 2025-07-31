const model = require('../models/vehicle');

exports.browse = (req, res)=>{
    res.render('./rentals/browse', {
        currentPage: 'browse',
        defaultStyles: true
    });
};

exports.rentals = (req, res)=>{
    res.render('./rentals/rentals', {
        currentPage: 'rentals',
        extraStyles: '/css/rentals.css',
        defaultStyles: true
    });
}

exports.payment = (req, res)=>{
    res.render('./rentals/payment', {
        currentPage: 'payment',
        extraStyles: '/css/rentals.css',
        defaultStyles: true
    });
};
