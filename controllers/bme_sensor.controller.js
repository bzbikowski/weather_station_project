var io = require('../bin/www');
var model = require("../models/bme_sensor.model");
var moment = require("moment");


exports.bme_post = function (req, res) {
    // read data from request, then convert it
    var temperature = parseFloat(req.body.temperature) / 100.0;
    var humidity = parseFloat(req.body.humidity) / 1024.0;
    var pressure = parseFloat(req.body.pressure) / 100.0;

    // create new model with parsed data
    var data = new model(
        {
            time: moment().add(1, 'hour'),
            temp_value: temperature,
            pres_value: pressure,
            hum_value: humidity
        }
    );
    // save model in database
    data.save(function (err) {
        if (err) {
	    return console.error(err);
        }
    });

    // send that data to clients
    io.emit('new_data', temperature, humidity, pressure);

    res.sendStatus(200);
};

exports.bme_get = function (req, res, next) {
    res.render('index', {title: 'Weather station'});
};

io.on('connection', function (socket) {
    // listen for signal 'ready' from each client
    socket.on('ready', async function () {
        var table;
        var text;
        // wait for and return all documents, which were created in last 60 seconds
        await model.find({time: {$gt: moment().subtract(60, 'second').toDate()}}, function (err, doc) {
            text = JSON.stringify(doc);
            table = JSON.parse(text);
        });
        // send to client documents
        io.emit('init_data', table);
    }

)
    ;
});

exports.view_temperature = function (req, res, next) {
    res.render('temp', {title: 'Weather station'});
};

exports.view_humidity = function (req, res, next) {
    res.render('hum', {title: 'Weather station'});
};

exports.view_pressure = function (req, res, next) {
    res.render('pre', {title: 'Weather station'});
};