var tempChart;
var humChart;
var presChart;
var flag = false;
var socket = io();

$(document).ready(function () {
    var chartStatus = checkforCharts();
    if (chartStatus[0]) {
        var tempData = {
            datasets: [{
                label: 'Temperature in °C',
                fill: false,
                lineTension: 0,
                borderColor: '#FF0000',
                backgroundColor: '#FFFFFF',
                pointBorderColor: '#000000',
                pointBackgroundColor: '#000000',
                data: []
            }]
        };
        tempChart = new Chart($("#tempChart"), {
            label: 'temperature',
            type: 'line',
            data: tempData,
            options: {
                title: {
                    display: true,
                    text: 'Temperature',
                    fontSize: 15
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                second: 'HH:mm:ss'
                            }
                        },
                        distribution: 'linear'
                    }]
                }
            }
        });
    }
    if (chartStatus[1]) {
        var humData = {
            datasets: [{
                label: 'Humidity in %',
                fill: false,
                lineTension: 0,
                borderColor: '#0a48ff',
                backgroundColor: '#FFFFFF',
                pointBorderColor: '#000000',
                pointBackgroundColor: '#000000',
                data: []
            }]
        };
        humChart = new Chart($("#humChart"), {
            label: 'humidity',
            type: 'line',
            data: humData,
            options: {
                title: {
                    display: true,
                    text: 'Humidity',
                    fontSize: 15
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                second: 'HH:mm:ss'
                            }
                        },
                        distribution: 'linear'
                    }]
                }
            }
        });
    }
    if (chartStatus[2]) {
        var presData = {
            datasets: [{
                label: 'Pressure in Pa',
                fill: false,
                lineTension: 0,
                borderColor: '#327a00',
                backgroundColor: '#FFFFFF',
                pointBorderColor: '#000000',
                pointBackgroundColor: '#000000',
                data: []
            }]
        };
        presChart = new Chart($("#presChart"), {
            label: 'pressure',
            type: 'line',
            data: presData,
            options: {
                title: {
                    display: true,
                    text: 'Pressure',
                    fontSize: 15
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                second: 'HH:mm:ss'
                            }
                        },
                        distribution: 'linear'
                    }]
                }
            }
        });
    }

    function addData(chart, label, data) {
        chart.data.datasets[0].data.push({x: label, y: data});
        chart.update();
    }

    function checkforCharts() {
        var i1 = false, i2 = false, i3 = false;
        var elem = document.getElementById('tempChart');
        if (elem !== null) {
            i1 = true;
        }
        elem = document.getElementById('humChart');
        if (elem !== null) {
            i2 = true;
        }
        elem = document.getElementById('presChart');
        if (elem !== null) {
            i3 = true;
        }

        return [i1, i2, i3];
    }

    socket.on('new_data', function (temperature, humidity, pressure) {
        if (chartStatus[0]) {
            addData(tempChart, moment(), temperature);
        }
        if (chartStatus[1]) {
            addData(humChart, moment(), humidity);
        }
        if (chartStatus[2]) {
            addData(presChart, moment(), pressure);
        }
    });

    socket.on('init_data', function (init_data) {
        // console.log(init_data);
        var elem;
        for (elem in init_data) {
            console.log(init_data[elem]);
            if (chartStatus[0]) {
                addData(tempChart, moment(init_data[elem]['time']).subtract(1, 'hour'), init_data[elem]['temp_value']);
            }
            if (chartStatus[1]) {
                addData(humChart, moment(init_data[elem]['time']).subtract(1, 'hour'), init_data[elem]['hum_value']);
            }
            if (chartStatus[2]) {
                addData(presChart, moment(init_data[elem]['time']).subtract(1, 'hour'), init_data[elem]['pres_value']);
            }
        }
    });
    socket.emit('ready', {});
});