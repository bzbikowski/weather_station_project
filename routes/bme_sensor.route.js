var express = require('express');
var router = express.Router();
var bme_controller = require('../controllers/bme_sensor.controller');


// Display graph formed from measured data
router.get('/', bme_controller.bme_get);

// Handle POST request from ESP8266 with measured values
router.post('/', bme_controller.bme_post);

// Display temperature graph in larger scale
router.get('/temperature/', bme_controller.view_temperature);

// Display humidity graph in larger scale
router.get('/humidity/', bme_controller.view_humidity);

// Display pressure graph in larger scale
router.get('/pressure/', bme_controller.view_pressure);


module.exports = router;
