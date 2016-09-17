//Link dependencies
var path = require('path');
var express = require('express');
var config = require('./config.json');
var io = require('socket.io-utils')();
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server


//Setup server
var app = express();
app.use(express.static(path.join(__dirname, '../', 'client'), {
    extensions: ['html'],
    index: 'index.html'
}));

//Middleware definitions
var logging = function (req, res, next) {
    console.log(new Date().toLocaleTimeString() + ' | Address: "' + req.originalUrl + '" | IP: "' + req.ip + '"');
    next();
};

//Middleware bindings
app.use(logging);

//Starts the server
var server = app.listen(config.port, function () {
    console.log(new Date().toLocaleTimeString() + ' | ' + config.server_name + ' Express server running on port ' + config.port);
    io.listen(server);
});


io.on('connection', function(socket){
    socket.on('createSession', function(data){
        console.log(data);
        MongoClient.connect(url, function(err, db) {
            var sessions = db.collection('sessions');
            sessions.insert(data);
            db.close();
        });

        io.emit("sendSession", 'Created');
    });

    socket.on('getSessions', function(data){
        var all_sessions;
        MongoClient.connect(url, function(err, db) {
            var sessions = db.collection('sessions');
            sessions.find().toArray(function(err, items){
                all_sessions = items;
                socket.emit('returnSessions', all_sessions);
            });
            db.close();
        });
    });
    console.log("User connected!");
});
