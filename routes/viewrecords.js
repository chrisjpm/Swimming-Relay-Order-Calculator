var express = require('express');
var router = express.Router();

/* GET view records page. */
router.get('/', function(req, res, next) {
  res.render('viewrecords', { domain: 'SROC - ', title: 'View Records', layout: 'layout.hbs' });
});

module.exports = router;
