var io = require('../bin/www');
var model = require("../models/bme_sensor.model");
var moment = require("moment");

exports.bme_post = function (req, res) {
    var temperature = parseFloat(req.body.temperature) / 100.0;
    var humidity = parseFloat(req.body.humidity) / 1024.0;
    var pressure = parseFloat(req.body.pressure) / 100.0;

    var data = new model(
        {
            time: moment().toDate(),
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
    // todo return last received values as json
    res.render('index', {title: 'Express'});
};

exports.view_temperature = function (req, res, next) {
    res.render('temp', {title: 'Express'});
};