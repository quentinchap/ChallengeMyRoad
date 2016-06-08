angular.module('starter.sensors')
    .controller('SensorsCtrl', SensorsCtrl);

SensorsCtrl.$inject = ['$interval', '$scope', 'sensorsService', 'speedLimitsService'];
function SensorsCtrl($interval, $scope, sensorsService, speedLimitsService) {
    var accelerationWatch = undefined;
    var positionWatch = undefined;
    var weatherWatch = undefined;
    var speedLimitWatch = undefined;

    $scope.loaded = false;

    $scope.coordinates = {
        latitude: undefined,
        longitude: undefined,
        altitude: undefined
    };
    $scope.speed = undefined;
    $scope.acceleration = {
        x: undefined,
        y: undefined,
        z: undefined
    };
    $scope.accuracy = undefined;

    $scope.temperature = undefined;
    $scope.pressure = undefined;
    $scope.humidity = undefined;
    $scope.windSpeed = undefined;

    $scope.speedLimit = undefined;

    initialize();

    function initialize() {
        registerPositionListener();
        registerAccelerationListener();
        registerWeatherListener();
        registerSpeedLimitListener();
    }

    function registerPositionListener() {
        positionWatch = navigator.geolocation.watchPosition(
            onPositionUpdate,
            onPositionError, {
                enableHighAccuracy: true
            });
    }

    function registerAccelerationListener() {
        if (undefined === window.DeviceMotionEvent) {
            console.error('Device motion not supported :(');
            throw new Error('Device motion not supported :(');
        }
        window.addEventListener('devicemotion', onAccelerationUpdate, true);
    }

    function registerWeatherListener() {
        $interval(updateWeather, 10 * 1000);
    }

    function registerSpeedLimitListener() {
        $interval(updateSpeedLimit, 10 * 1000);
    }

    function onPositionError(err) {
        console.error('Failed to retrieve position', err);
    }

    function onPositionUpdate(position) {
        var positionUndefined = undefined === $scope.latitude;
        $scope.coordinates.latitude = position.coords.latitude;
        $scope.coordinates.longitude = position.coords.longitude;
        $scope.coordinates.altitude = position.coords.altitude;
        $scope.speed = position.coords.speed;
        $scope.accuracy = position.coords.accuracy;
        if (positionUndefined) {
            // Load position-based metrics
            updateWeather();
            updateSpeedLimit();
        }
    }

    function onAccelerationUpdate(event) {
        var acceleration = event.accelerationIncludingGravity;
        $scope.acceleration.x = acceleration.x;
        $scope.acceleration.y = acceleration.y;
        $scope.acceleration.z = acceleration.z;
    }

    function updateWeather() {
        sensorsService.getWeatherConditions($scope.coordinates)
            .then(function (weather) {
                $scope.temperature = weather.data.main.temp;
                $scope.pressure = weather.data.main.pressure;
                $scope.humidity = weather.data.main.humidity;
                $scope.windSpeed = weather.data.wind.speed;
            });
    }

    function updateSpeedLimit() {
        speedLimitsService.getSpeedLimitAtPosition($scope.coordinates, $scope.accuracy)
            .then(function (speedLimit) {
                $scope.speedLimit = speedLimit;
                $scope.loaded = true;
            });
    }
}