var store = require('../store/store');
var errors = require('../errors');
var moment = require('moment');

var statusCodes = {
  pending: 0,
  dispatched: 1,
  enroute: 2,
  arrivedandwaiting: 3,
  pickedup: 4,
  droppedoff: 5,
  complete: 6,
  cancelled: 7
};

function addTrip(trip, cb) {
  store.addTrip(convertToRow(trip), function(err, id){
    if (err) {
      console.log(err);
      cb(errors.ERROR_CREATING_TRIP);
    }
    else
      cb(null, id);
  });
}

function getTrip(trip, cb) {
  cb(errors.ERROR_NOT_IMPLEMENTED);
}

function convertToRow(trip) {
  var row = {};

  if (trip.code)
    row.code = trip.code;

  if (trip.partnerId)
    row.partner_id = trip.partnerId;

  if (trip.passengerName)
    row.passenger_name = trip.passengerName;

  if (trip.distanceInMiles)
    row.distance = trip.distanceInMiles;

  if (trip.status)
    row.status = statusCodes[trip.status];

  if (trip.dispatch){
    if (trip.dispatch.lat)
      row.dispatch_lat = trip.dispatch.lat;
    if (trip.dispatch.lon)
      row.dispatch_lon = trip.dispatch.lon;
    if (trip.dispatch.time)
      row.dispatch_time = moment(trip.dispatch.time).toDate();
  }

  if (trip.pickup){
    if (trip.pickup.lat)
      row.pickup_lat = trip.pickup.lat;
    if (trip.pickup.lon)
      row.pickup_lon = trip.pickup.lon;
    if (trip.pickup.time)
      row.pickup_time = moment(trip.pickup.time).toDate();
  }

  if (trip.dropoff){
    if (trip.dropoff.lat)
      row.dropoff_lat = trip.dropoff.lat;
    if (trip.dropoff.lon)
      row.dropoff_lon = trip.dropoff.lon;
    if (trip.dropoff.time)
      row.dropoff_time = moment(trip.dropoff.time).toDate();
  }
  
  row.created = new Date();
  row.last_update = row.created;
  
  return row;
}


module.exports.addTrip = addTrip;
module.exports.getTrip = getTrip;