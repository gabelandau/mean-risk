'use strict';

var mongoose = require('mongoose');

var brotherSchema = new mongoose.Schema({
	name: String,
	initiation_number: Number
});

var model = mongoose.model('Brother', brotherSchema);

module.exports = model;
