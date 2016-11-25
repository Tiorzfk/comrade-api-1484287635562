var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var passport = require('passport');
var flash    = require('connect-flash');
var session  = require('express-session');
var cors = require('cors');
var RateLimit = require('express-rate-limit');
//db
var connection = require('./config/db');
//routing
var posting = require('./app/routes/posting');
var banner = require('./app/routes/banner');
var event = require('./app/routes/event');
var friend = require('./app/routes/friend');
var kategori = require('./app/routes/kategori');
var lokasi_obat = require('./app/routes/lokasi_obat');
var lokasi_pemeriksaan = require('./app/routes/lokasi_pemeriksaan');
var sahabatodha = require('./app/routes/sahabatodha');
var sticker = require('./app/routes/sticker');
var twitter = require('./app/routes/twitter');
var user = require('./app/routes/user');
var sms = require('./app/routes/sms');
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//require('./config/passport')(passport); // pass passport for configuration

/*var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

app.use(limiter);*/

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' ,resave: true, saveUninitialized: true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//koneksi
connection.init();
//routing
posting.configure(app);
banner.configure(app);
event.configure(app);
friend.configure(app);
kategori.configure(app);
lokasi_obat.configure(app);
lokasi_pemeriksaan.configure(app);
sahabatodha.configure(app);
sticker.configure(app);
twitter.configure(app);
user.configure(app,passport);
sms.configure(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
});

// error handlers

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
