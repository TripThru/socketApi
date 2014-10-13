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
    

The mysql db needs to be initialized with the script in /store/db.txt.

