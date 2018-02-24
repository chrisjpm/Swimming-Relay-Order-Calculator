var express = require('express');
var router = express.Router();

/* GET add records page. */
router.get('/', function(req, res, next) {
  res.render('addrecords', { domain: 'SROC - ', title: 'Add Records', layout: 'layout.hbs' });
});

module.exports = router;
