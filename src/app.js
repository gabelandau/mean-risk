'use strict';

// Setup dependencies
var express = require('express');
var router = require('./api');

// Create express app
var app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/../views');

// Connect to MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/treasurer');

// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.use('/api', router);

// Create express listen server
app.listen(3000, function() {
    console.log("Server is running on port 3000!");
});
