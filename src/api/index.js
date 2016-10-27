'use strict';

var express = require('express');
var Brother = require('../models/brother');

var router = express.Router();

router.get('/v1/brothers', function(req, res) {
    res.json({
        "test": 1
    });
});

module.exports = router;
