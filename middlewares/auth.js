
const User = require('../models/user');

// check if user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('warning', 'You are already logged in');
        return res.redirect('/users/profile');
    }
};

// check if user is authenticated
exports.isLoggedIn = async (req, res, next) => {
    if (req.session.user) {
        // Attach the session user to req.user
        req.user = await User.findById(req.session.user).lean();

        return next();
    } else {
        req.flash('loginRequired', 'You need to log in first to access this feature');
        return res.redirect('/users/login');
    }
};