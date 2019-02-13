var tempChart, humChart, presChart;

var socket = io();

$(document).ready(function () {
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

    function addData(chart, label, data) {
        chart.data.datasets[0].data.push({x: label, y: data});
        chart.update();
    }

    socket.on('new_data', function (temperature, humidity, pressure) {
        addData(tempChart, moment(), temperature);
        addData(humChart, moment(), humidity);
        addData(presChart, moment(), pressure);
    });
});