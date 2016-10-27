'use strict';

// Setup dependencies
var express = require('express');
var router = require('./api');
var bodyParser = require('body-parser');
require("console-stamp")( console, {
	metadata: function () {
    	return ("[risk]");
	},
	colors: {
    	stamp: "yellow",
    	label: "white",
    	metadata: "green"
	},
    pattern: "dd/mm HH:MM:ss"
});

// Create express app
var app = express(); // Create app
app.use(bodyParser.json()); // Parse POST/PUT request body
app.set('view engine', 'pug');
app.set('views', __dirname + '/../views');

// Require database connection
require('./database');

// Index view
app.get('/', function(req, res) {
    res.render('index');
});

// Import API routes
app.use('/api', router);

// Create express listen server
app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
