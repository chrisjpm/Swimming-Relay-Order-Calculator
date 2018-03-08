var express = require('express'); // require the express package
var router = express.Router(); // set up the route

/* GET view records page. */
router.get('/', function(req, res, next) {
  // render the var from app.js and set the value of the vars domain, title and layout
  // these are used within the HBS file
  res.render('viewrecords', { domain: 'SROC - ', title: 'View Records', layout: 'layout.hbs' });
});

module.exports = router; // export the route to display the page
