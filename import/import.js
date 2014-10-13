var client = require('./socketclient');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var _ = require('lodash');
var moment = require('moment');

var multiplexCount = 100;
var url = 'mongodb://SG-TripThru-3328.servers.mongodirector.com:27017/netrotripthrucom';

importTrips(url, 'trips', function(err, results){
  console.log(err, results);
});

//retrieves trips from mongo db and inserts using socket api client
function importTrips(url, collectionName, cb) {
  MongoClient.connect(url, function(err, db) {
    if (err)
      return cb(err);
    
    console.log('getting trips');
    
    var collection = db.collection(collectionName);
    
    var partners = {};
    
    collection.find({}).toArray(function(err, docs) {
      if (err)
        return cb(err);
      
      db.close();

      //create function to add each trip
      var fns = _.reduce(docs, function(acc, item){
        if (item.Status === 'Complete') {
          acc.push(function(cb){
            client.addTrip(convert(item), cb);
          });
        }
        return acc;
      }, []);

      async.parallelLimit(fns, multiplexCount, cb);
    });      
  });
}


//convert from mongo json 
function convert(src) {
  var trip = {
    partnerId: 1,
    code: src._id,
    dispatch: {
      time: moment(src.Creation).toISOString()
    },
    pickup: {
      lat: src.PickupLocation.Lat,
      lon: src.PickupLocation.Lng,
      time: moment(src.PickupTime).toISOString()
    },
    dropoff: {
      lat: src.DropoffLocation.Lat,
      lon: src.DropoffLocation.Lng,
      time: moment(src.LastUpdate).toISOString()
    },
    passengerName: src.PassengerName,
    status: 'complete',
    distanceInMiles: src.OccupiedDistance
  };
 
  return trip;
}
