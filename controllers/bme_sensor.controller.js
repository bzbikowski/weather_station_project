var io = require('../bin/www');
var mongoose = require('mongoose');
var model = require("../models/bme_sensor.model");
var moment = require("moment");

exports.bme_post = function (req, res) {
    var temperature = parseFloat(req.body.temperature) / 100.0;
    var humidity = parseFloat(req.body.humidity) / 1024.0;
    var pressure = parseFloat(req.body.pressure) / 100.0;

    var data = new model(
        {
            time: moment().add(1, 'hour'),
            temp_value: temperature,
            pres_value: pressure,
            hum_value: humidity
        }
    );

    data.save(function (err) {
        if (err) {
	    return console.error(err);
        }
    });

    io.emit('new_data', temperature, humidity, pressure);

    res.sendStatus(200);
};

exports.bme_get = function (req, res, next) {
    res.render('index', {title: 'Express'});
};

io.on('connection', function (socket) {
    socket.on('ready', async

    function () {
        var table;
        var text;
        await
        model.find({time: {$gt: moment().subtract(7200, 'second').toDate()}}, function (err, doc) {
            text = JSON.stringify(doc);
            table = JSON.parse(text);
        });
        io.emit('init_data', table);
    }

)
    ;
});

exports.view_temperature = function (req, res, next) {
    res.render('temp', {title: 'Express'});
};

exports.view_humidity = function (req, res, next) {
    res.render('hum', {title: 'Express'});
};

exports.view_pressure = function (req, res, next) {
    res.render('pre', {title: 'Express'});
};