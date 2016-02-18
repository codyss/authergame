'use strict';

var app = require('./app'),
	db = require('./db'),
  fs = require('fs'),
  privateKey = fs.readFileSync('key.pem', 'utf8'),
  certificate = fs.readFileSync('cert.pem', 'utf8'),
  https = require('https');



var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8081);

var port = 8080;

var server = app.listen(port, function () {
	console.log('HTTP server patiently listening on port', port);
  console.log('HTTPS server patiently listening on port', 8081);
});

module.exports = server;