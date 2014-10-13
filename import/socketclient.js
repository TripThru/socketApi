var io = require('socket.io-client');

var querystring = require('querystring');

var addr = 'http://localhost:3300';
var token = 'token123';

var socket = io.connect(addr, {
  query: querystring.stringify({token:token}),
  transports: ['websocket']
});

socket.on('connect', function () {
  console.log('connect');
});
socket.on('error', function (data) {
  console.log('Error', data);
});
socket.on('disconnect', function () {
  console.log('disconnect');
});

function addTrip(trip, cb) {
  socket.emit('add-trip', trip, cb);
}

function getTrip(id, cb) {
  socket.emit('get-trip', id, cb);
}


module.exports.addTrip = addTrip;
module.exports.getTrip = getTrip;
