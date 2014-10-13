var _ = require('lodash');

function createTrip(req, res, next) {

  res.json({});
}

function updateTrip(req, res, next) {
  var id = req.params.tripId;

  res.json({});
}

function getTrip(req, res, next) {
  var id = req.params.tripId;
  
  res.json({});
}

module.exports.createTrip = createTrip;
module.exports.updateTrip = updateTrip;
module.exports.getTrip = getTrip;

