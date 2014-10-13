var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');
var trips = require('./routes/trips');
var users = require('./routes/users');
var config = require('./config');
var socket = require('./socket');

var app = express();

app.set('port', process.env.PORT || config.port);

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}));

app.use(function(err, req, res, next){
  res.json(500, {error:'unexpected error'});
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Method", "GET,PUT,POST,DELETE,HEAD,OPTIONS");
  next();
});

//middleware to make sure user is logged in
function requireLoginApi(req, res, next){
  if (req.session.user)
    next();
  else
    res.json(401, {error: 'authentication required'});
}

//middleware to require admin user
function requireAdmin(req, res, next){
  if (req.session.user && req.session.user.isadmin)
    next();
  else
    res.json(403, {error: 'access denied'});
}

app.post('/api/v1/login', users.login);
app.get('/api/v1/logout', users.logout);
app.get('/api/v1/users/me', requireLoginApi, users.getCurrentUser);
app.get('/api/v1/users/:userId', requireLoginApi, users.getUser);
app.post('/api/vi/users', requireLoginApi, requireAdmin, users.createUser);

app.post('/api/v1/trips', requireLoginApi, trips.createTrip);
app.post('/api/v1/trips/:tripId', requireLoginApi, trips.updateTrip);
app.get('/api/v1/trips/:tripId', requireLoginApi, trips.getTrip);

//all setup -- start listening
var server = app.listen(app.get('port'), function () {
  console.log("server listening on port " + app.get('port'));

  socket.io.attach(server);
});


