var express = require('express');
var router = express.Router();
// var path = require('path');
// var io = require('../bin/www');

/* GET home page. */
router.get('/', function (req, res, next) {
    // todo init data from database to client
    res.render('index', {title: 'Express'});
});

module.exports = router;
