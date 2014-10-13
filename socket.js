var trips = require('./model/trips');

var io = require('socket.io')({
  transports:['websocket']
});

//no need for server to serve client files
io.serveClient(false);

//authentication middleware
io.use(function(socket, next){
  var query = socket.handshake.query;

  if (!query || !query.token)
    next("Invalid connection attempt");
  else if (query.token !== 'token123') //TODO: validate against store
    next("Invalid access token");
  else
    next();
});

io.sockets.on('connection', function (socket) {

  //TODO: log connect

  socket.on('add-trip', trips.addTrip);
  socket.on('get-trip', trips.getTrip);
  
  socket.on('disconnect', function(){
    //TODO: log disconnect
  });
});

module.exports.io = io;