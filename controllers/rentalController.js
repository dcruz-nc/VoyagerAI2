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
