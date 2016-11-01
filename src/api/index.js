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
    Brother.create({
        name: req.body.name,
        initiation_number: req.body.initiation_number,
        points: req.body.points,
        executive_council: req.body.executive_council,
        coop: req.body.coop,
        senior: req.body.senior
    }, function (err, small) {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            res.json({ message: req.body.name + " was added to the database." });
        }
    })
});

// Update brother by initiation number
router.put('/v1/brother/:id', function(req, res) {
    var id = req.params.id;

    Brother.findOneAndUpdate({ 'initiation_number': id }, {
        name: req.body.name,
        points: req.body.points,
        executive_council: req.body.executive_council,
        coop: req.body.coop,
        senior: req.body.senior
    }, function (err, brother) {
      if (err) {
          console.log(err);
      }
      res.send(brother);
    });
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
