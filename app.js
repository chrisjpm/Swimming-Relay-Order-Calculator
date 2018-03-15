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
  // host: "173.194.106.215",
  // user: "admin", //test
  // password: "admin"
  host: => ENV['db_host'],
  user: => ENV['db_user'],
  password: => ENV['db_pass']
});

//check connection on app start
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

// use route (javascript file) for said page (route says what layout and view (hbs files) to use
app.use('/', index);
app.use('/addrecords', addrecords);
app.use('/viewrecords', viewrecords);
app.use('/calculator', calculator);

// Post swimmer from html form to swimmer and distance_pb tables with either success alert or error message
app.post('/addrecords', function (req, res) {
    con.query('INSERT INTO sroc.swimmer SET ?', req.body.swimmer,
      function (err, result) {
        if(err) throw err;
        console.log('Swimmer\'s details added to database with ID: ' + result.insertId);

        // Insert times with the new swimmer id and stroke id asscociated
        insertDistancePBs(result.insertId, req.body.distance_pb, function(){
          res.send(true);
        });
      }
    );
});

function insertDistancePBs(swimmerId, distance_data, callback){
  // Because it will query asynchronously, we don't know which query will finish last (meaning we can't put the call back on the last query with 100% guarantee it is last to finish)
  // var done_query increments when a query is successful and in each query, if it equals 4 (4 queries) it will reurrn callback
  var done_queries = 0;
  // fly
  con.query('INSERT INTO sroc.distance_pb SET stroke_id=1, swimmer_id=' + swimmerId + ', ?', distance_data.fly,
    function (err, result2) {
      if(err) throw err;
      done_queries++;
      console.log('Fly times added to database for swimmer with ID: ' + swimmerId);
      if(done_queries == 4){
        return callback();
      }
    }
  );
  // bc
  con.query('INSERT INTO sroc.distance_pb SET stroke_id=2, swimmer_id=' + swimmerId + ', ?', distance_data.bc,
    function (err, result2) {
      if(err) throw err;
      done_queries++;
      console.log('Bc times added to database for swimmer with ID: ' + swimmerId);
      if(done_queries == 4){
        return callback();
      }
    }
  );
  // brs
  con.query('INSERT INTO sroc.distance_pb SET stroke_id=3, swimmer_id=' + swimmerId + ', ?', distance_data.brs,
    function (err, result2) {
      if(err) throw err;
      done_queries++;
      console.log('Brs times added to database for swimmer with ID: ' + swimmerId);
      if(done_queries == 4){
        return callback();
      }
    }
  );
  // fc
  con.query('INSERT INTO sroc.distance_pb SET stroke_id=4, swimmer_id=' + swimmerId + ', ?', distance_data.fc,
    function (err, result2) {
      if(err) throw err;
      done_queries++;
      console.log('Fc times added to database for swimmer with ID: ' + swimmerId);
      if(done_queries == 4){
        return callback();
      }
    }
  );
}

// Request swimmers details for inserting into HTML table on the view records page
app.post('/viewrecords', function (req, res) {
    con.query('SELECT swimmer_forename, swimmer_surname, swimmer_dob, swimmer_gender FROM sroc.swimmer ORDER BY swimmer_id DESC',
      function (err, result) {
        if(err) throw err;
        console.log('Swimmer\'s details requested');
        res.send(result);
    });
});

// Select swimmers and the applicable times for the calculation
app.post('/calculator', function (req, res) {
    // Set vars to inputs in html form
    yob = req.body.swimmerDetails.swimmer_dob;
    gender = req.body.swimmerDetails.swimmer_gender;
    relayType = req.body.relayDetails.relay_type;
    distancePb = req.body.relayDetails.relay_distance;

    // Insert times with the new swimmer id and stroke id asscociated
    getSwimmers(yob, gender, relayType, distancePb, function(data){
      res.send(data);
    });
});

function getSwimmers(yob, gender, relayType, distancePb, callback){
  // Because it will query asynchronously, we don't know which query will finish last (meaning we can't put the call back on the last query with 100% guarantee it is last to finish)
  // var done_query increments when a query is successful and in each query, if it equals 2 (2 queries) it will reurrn callback
  // Swimmer details and time(s) required for relay
  var query = 'SELECT sroc.swimmer.swimmer_forename, sroc.swimmer.swimmer_surname, sroc.swimmer.swimmer_dob, sroc.swimmer.swimmer_gender, sroc.distance_pb.' + distancePb + ', sroc.stroke.stroke_name FROM sroc.swimmer INNER JOIN sroc.distance_pb ON sroc.swimmer.swimmer_id=sroc.distance_pb.swimmer_id INNER JOIN sroc.stroke ON sroc.distance_pb.stroke_id=sroc.stroke.stroke_id WHERE year(sroc.swimmer.swimmer_dob)=' + yob + ' AND sroc.swimmer.swimmer_gender=' + gender + ' AND sroc.distance_pb.stroke_id IN (' + relayType + ')';
  con.query(query,
    function (err, result2) {
      if(err) throw err;
      console.log('Selected swimmer by age and gender and the applicable times');
      return callback(result2);
  });
}

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
