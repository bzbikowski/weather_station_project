var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bmeRouter = require('./routes/bme_sensor.route');

var app = express();

var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017/home_automation';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/bme_sensor', bmeRouter);

app.use('/js', express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/js', express.static(__dirname + '/node_modules/moment/'));
app.use('/js', express.static(__dirname + '/public/javascripts/'));
app.use('/js', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/css', express.static(__dirname + '/public/stylesheets/'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
