var _ = require('lodash'),
  config = require('../config'),
  pass = require('pwd'),
  store = require('../store/store'),
  errors = require('../errors');

function logoutCurrentUser(req, res, next) {
  if (req.session && req.session.user) {
    req.session.destroy(function(err){
      res.json({});
    });
  }
  else {
    res.json({});
  }
}

function getCurrentUser(req, res, next) {
  res.json({user:req.session.user.username});
}

function getUser(req, res, next) {
  res.json(400, errors.ERROR_NOT_IMPLEMENTED);
}

function createUser(req, res, next) {
  /*user object should be the body
   * {
    username: '',
    email: '',
    password: ''
   }
   **/
  pass.hash(req.body.pwd, config.salt, function(err, hash){
    if (err)
      res.json(400, errors.ERROR_CREATING_USER);
    else {
      hash = new Buffer(hash, 'binary').toString('base64');
      
      store.createUser(req.body.username, req.body.email, hash, config.salt, function(err, id){
        if (err)
          res.json(400, errors.ERROR_CREATING_USER);
        else {
          store.getUserById(id, function(err, user){
            if (err)
              res.json(400, errors.ERROR_CREATING_USER);
            else {
              req.session.user = user;
              res.json({user: user.username});
            }
          });
        }
      });
    }
  });  
}

function loginUser(req, res, next) {
  //if user is already logged in, log out first
  if (req.session.user) {
    req.session.destroy(function(err){
      authenticateUser(req, res, next);
    });
    return;
  }
  
  if (!req.body.username || !req.body.pwd) {
    res.json(400, errors.ERROR_REQUIRED_PARAMETER_MISSING);
    return;
  }
 
  store.getUserByUsername(req.body.username, function(err, user){
    if (err || !user)
      res.json(400, errors.ERROR_INVALID_LOGIN);
    else {
      pass.hash(req.body.pwd, user.salt, function(err, hash){
        hash = new Buffer(hash, 'binary').toString('base64');
        if (user.pwdhash == hash) {
          req.session.user = user;
          res.json({user: user.username});
        }
        else
          res.json(400, errors.ERROR_INVALID_LOGIN);
      })
    }
  });
}

module.exports.login = loginUser;
module.exports.logout = logoutCurrentUser;
module.exports.getCurrentUser = getCurrentUser;
module.exports.getUser = getUser;
module.exports.createUser = createUser;

