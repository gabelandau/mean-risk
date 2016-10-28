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
    points: {
        type: Number,
        default: 0
    },
    executive_council: {
        type: Boolean,
        default: false
    },
    coop: {
        type: Boolean,
        default: false
    },
    senior: {
        type: Boolean,
        default: false
    },
});

var model = mongoose.model('Brother', brotherSchema);

module.exports = model;
