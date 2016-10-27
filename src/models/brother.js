'use strict';

var mongoose = require('mongoose');

var brotherSchema = new mongoose.Schema({
	name: {
        type: String,
        required: [true, "You must enter an name"]
    },
	initiation_number: {
        type: Number,
        required: [true, "You must enter an initiation number"]
    },
    points: Number,
    executive_council: Boolean,
    coop: Boolean,
    senior: Boolean
});

var model = mongoose.model('Brother', brotherSchema);

module.exports = model;
