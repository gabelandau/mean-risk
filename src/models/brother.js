'use strict';

var mongoose = require('mongoose');

var brotherSchema = new mongoose.Schema({
	name: String,
	initiation_number: Number,
    points: Number,
    executive_council: Boolean,
    coop: Boolean,
    senior: Boolean
});

var model = mongoose.model('Brother', brotherSchema);

module.exports = model;
