socketApi
=========

A first pass at a dual interface api for tripthru. Supports actions over http and websockets. 
Mostly POC right now with very limited apicoverage (pretty much just createTrip)

An import script uses a primitive socket based api client to pull trips from existing mongo db
and push to new api. Currently trips are stored in a mysql db.

Setup on Linux

    apt-get install git
    apt-get install nodejs
    apt-get install npm
    apt-get install mysql-server
    apt-get install mysql-client

    cd ~/dev
    git clone https://github.com/TripThru/socketApi.git
    cd socketApi
    npm install
    

Configuration
    1. The mysql db needs to be initialized with the script in ./store/db.txt.
    2. Edit the config.js file to set db credentials, port, etc.
    
Operation
    cd ~/dev/socketApi
    node server
 
Import

    cd ~/dev/socketApi/import
    node import

Notes
Mysql inserts aren't done under a single transaction, so log flushing slows things down. 
This can be improved by setting:
    
    SET GLOBAL innodb_flush_log_at_trx_commit=2;
    
 
    

