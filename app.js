// requiring packages
var hbs = require('express-hbs');
var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');

// assigning routes
var index = require('./routes/index');
var addrecords = require('./routes/addrecords');
var viewrecords = require('./routes/viewrecords');
var calculator = require('./routes/calculator');

// create connection to Google Cloud sql database
var con = mysql.createConnection({
  host: "173.194.106.215",
  user: "admin",
  password: "admin"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// assign port
var app = express();
var port = (process.env.PORT || 80); //process.env.PORT required for heroku
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('port', port);

// see get and post requests in console and set up public directory
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));

// set up directory for the layout and the partials
app.engine('hbs', hbs.express4({
    defaultLayout: path.join(__dirname, '/views/layout.hbs'),
    partialsDir: path.join(__dirname, '/views/partials')
}));

// use route for said page (route says what layout and view (hbs files) to use)
app.use('/', index);
app.use('/addrecords', addrecords);
app.use('/viewrecords', viewrecords);
app.use('/calculator', calculator);

// Post swimmer from html form to swimmer and distance_pb tables with either success alert or error message
app.post('/addrecords', function (req, res) {
    con.query('INSERT INTO sroc.swimmer SET ?', req.body,
      function (err, result) {
        if(err) throw err;
        console.log('Swimmer\'s details added to database with ID: ' + result.insertId);
        res.send("true");
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler (displays errors on the 404 page)
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start app on var port
server.listen(port);
module.exports = app;
