var express = require('express');
var router = express.Router();


var bme_controller = require('../controllers/bme_sensor.controller');

router.get('/', bme_controller.bme_get);

router.post('/', bme_controller.bme_post);

router.get('/temperature/', bme_controller.view_temperature);

module.exports = router;