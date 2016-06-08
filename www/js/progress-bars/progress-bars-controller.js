angular.module('starter.progress-bars')
    .controller('ProgressBarsCtrl', ProgressBarCtrl);

ProgressBarCtrl.$inject = ['$interval', '$scope', 'sensorsService', 'speedLimitsService'];
function ProgressBarCtrl($interval, $scope, sensorsService, speedLimitsService) {
    var accelerationWatch = undefined;
    var positionWatch = undefined;
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
    $scope.speedLimit = undefined;
    $scope.points = 0;

    initialize();

    function initialize() {
        registerPositionListener();
        registerAccelerationListener();
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
            updateSpeedLimit();
        }
    }

    function onAccelerationUpdate(event) {
        var acceleration = event.accelerationIncludingGravity;
        $scope.acceleration.x = acceleration.x;
        $scope.acceleration.y = acceleration.y;
        $scope.acceleration.z = acceleration.z;
    }

    function updateSpeedLimit() {
        speedLimitsService.getSpeedLimitAtPosition($scope.coordinates, $scope.accuracy)
            .then(function (speedLimit) {
                $scope.speedLimit = speedLimit;
                $scope.loaded = true;
            });
    }
}