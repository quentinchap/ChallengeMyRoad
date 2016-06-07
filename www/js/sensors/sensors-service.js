angular.module('starter.sensors')
    .factory('sensorsService', sensorsService)
    .constant('Sensors', {
        ACCELEROMETER: 'accelerometer'
    });

sensorsService.$inject = ['$http', '$q', 'Sensors'];
function sensorsService($http, $q, Sensors) {

    var backendURL = 'http://localhost/foo';

    var service = {
        postAccelerometerData: postAccelerometerData,
        getWeatherConditions: getWeatherConditions
    };

    return service;

    function postAccelerometerData(position, acceleration) {
        return $http.post(backendURL, {
            timestamp: Date.now(),
            gpsLatitude: position.latitude,
            gpsLongitude: position.longitude,
            sensor: Sensors.ACCELEROMETER,
            details: [
                {
                    key: 'xAcceleration',
                    value: acceleration.x
                }, {
                    key: 'yAcceleration',
                    value: acceleration.y
                }, {
                    ky: 'zAcceleration',
                    value: acceleration.z
                }
            ]
        });
    }

    function getWeatherConditions(position) {
        return $http.get('http://api.openweathermap.org/data/2.5/weather?'
            + 'APPID=b7245e8575c26e38fb90eba427d1b19a&'
            + 'lat=' + position.latitude + '&'
            + 'lon=' + position.longitude);
    }
}