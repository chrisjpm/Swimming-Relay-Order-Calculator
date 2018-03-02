var express = require('express');
var router = express.Router();

/* GET calculator page. */
router.get('/', function(req, res, next) {
  res.render('result', { domain: 'SROC - ', title: 'Result', layout: 'layout.hbs' });
});

module.exports = router;
