var config = require('../config');
var mysql = require('mysql');
var pool  = mysql.createPool(config.db);

function Store(){
  this.addTrip = function(tripRow, cb){
    execSql('insert into trip set ?', tripRow, function(err, result){
      if (err)
        cb(err);
      else
        cb(null, result.insertId);
    });
  }

  this.getTripById = function(tripId, cb){
    execSql('select * from trip where id=?', [tripId], function(err, rows){
      if (err)
        cb(err);
      else if (rows.length == 1)
        cb(null, rows[0]);
      else
        cb(Error('Trip not found: ' + tripId));
    });
  }

  //user
  this.getUserByUsername = function(username, cb){
    execSql('select * from user where username=?', [username], function(err, results){
      if (err)
        cb(err);
      else if (results.length == 1)
        cb(null, results[0]);
      else
        cb();
    });
  }

  this.getUserById = function(id, cb){
    execSql('select * from user where id=?', [id], function(err, results){
      if (err)
        cb(err);
      else if (results.length == 1)
        cb(null, results[0]);
      else
        cb();
    });
  }

  this.createUser = function(username, email, pwdhash, salt, cb){
    execSql('insert into user (username, email, pwdhash, salt) values (?, ?, ?, ?)',
      [username, email, pwdhash, salt],
      function(err, res){
        if (err)
          cb(err);
        else
          cb(null, res.insertId);
      }
    );
  }

}  

function execSql(cmd, params, cb){
  pool.getConnection(function(err, connection) {
    if (err)
      cb(err);
    else {
      var q = connection.query(cmd, params, function(err, rows){
        connection.release();
        cb(err, rows);
      });
    }
  });
}

function makeString(json){
  return typeof json != 'string'?JSON.stringify(json):json;
}

function expandRows(rows, cols){
  for (var i in rows)
    expand(rows[i], cols);
  return rows;
}

function expand(row, cols){
  for (var i in cols){
    try {
      row[cols[i]] = JSON.parse(row[cols[i]]);
    }
    catch(ex){
    }
  }
  return row;
}

module.exports = new Store();