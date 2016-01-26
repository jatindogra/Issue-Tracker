var express = require('express');
var async = require('async');
var request = require('request');
var https = require('https');
var config = require('./config');
var app = express();

var router = express.Router();

app.use(express.static(__dirname + "/public"));

require('./routes/index')(router, request, async, config);

app.use('/api', router);

app.listen(3000);
console.log('server running');
