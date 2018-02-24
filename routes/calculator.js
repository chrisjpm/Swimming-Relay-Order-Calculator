var express = require('express');
var router = express.Router();

/* GET calculator page. */
router.get('/', function(req, res, next) {
  res.render('calculator', { domain: 'SROC - ', title: 'Calculator', layout: 'layout.hbs' });
});

module.exports = router;
