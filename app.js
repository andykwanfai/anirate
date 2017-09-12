var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mysql = require('mysql');

var routes = require('./routes/index');
//var users = require('./routes/users');
//var anime = require('./routes/anime');
var ac = require('./routes/login');
var reg = require('./routes/reg');
var rating = require('./routes/rating');
var comment = require('./routes/comment');
var season_list = require('./routes/season_list')
var search = require('./routes/search');
var profile = require('./routes/profile');
//var test = require('./routes/test');

var app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(expressSession({secret: '123'}));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up db connection
/*var connection = mysql.createConnection({
    host : process.env.IP,
    port : 3306,
    user : 'qqwq',
    password : '',
    database : 'anime'
});

connection.connect();
*/
/*
app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}));*/

app.use('/', routes);
app.use('/login',ac );
app.use('/reg',reg);
app.use('/rating',rating);
app.use('/comment',comment);
app.use('/season',season_list);
app.use('/search',search);
app.use('/profile', profile);
//app.use('/anime', anime);
//app.use('/ac', ac);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
