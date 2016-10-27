'use strict';

var express = require('express');
var Brother = require('../models/brother');

var router = express.Router();

// Get all brothers
router.get('/v1/brothers', function(req, res) {
    Brother.find({}, function(err, brothers) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ brothers: brothers });
    });
});

// Get one brother by initiation number
router.get('/v1/brother/:id', function(req, res) {
    var id = req.params.id;

    Brother.find({ 'initiation_number': id }, function(err, brother) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ brother: brother });
    })
});

// Create new brother
router.post('/v1/brother', function(req, res) {
    // To-do: Add code for new brother models
});

// Delete brother by initiation number
router.delete('/v1/brother/:id', function(req, res) {
    var id = req.params.id;

    Brother.findOneAndRemove({ 'initiation_number': id }, function(err, result) {
        if (err) {
          return res.status(500).json({ err: err.message });
        }
        res.json({ message: 'Brother ' + id + ' Deleted' });
    });
});

module.exports = router;
