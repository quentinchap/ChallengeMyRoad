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
    $scope.speedProgress = 50;
    $scope.brakingProgress = 50;
    $scope.accelerationProgress = 50;
    $scope.meters = 0;
    var pointsUpdateThreshold = 50;

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
        speedLimitWatch = $interval(updateSpeedLimit, 30 * 1000);
    }

    function onPositionError(err) {
        console.error('Failed to retrieve position', err);
    }

    function onPositionUpdate(position) {
        var positionUndefined = undefined === $scope.coordinates.latitude;
        if (!positionUndefined) {
            var dist = distance($scope.coordinates.latitude, $scope.coordinates.longitude, position.coords.latitude, position.coords.longitude);
            console.log(dist);
            if ($scope.meters % pointsUpdateThreshold < pointsUpdateThreshold && ($scope.meters % pointsUpdateThreshold) + dist >= pointsUpdateThreshold) {
                var points = ((($scope.meters % pointsUpdateThreshold) + dist - pointsUpdateThreshold) / pointsUpdateThreshold) | 0;
                addPoints(points);
            }
            $scope.meters += dist;
        }
        $scope.coordinates.latitude = position.coords.latitude;
        $scope.coordinates.longitude = position.coords.longitude;
        $scope.coordinates.altitude = position.coords.altitude;
        $scope.speed = position.coords.speed;
        $scope.accuracy = position.coords.accuracy;
        if (positionUndefined) {
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
                $scope.speedLimit = undefined !== speedLimit ? speedLimit * 1000 : undefined;
                $scope.loaded = true;
            });
    }

    function distance(lat0, long0, lat1, long1) {
        var r = 6371000; // earth radius
        var phi0 = lat0 / 180 * Math.PI;
        var phi1 = lat1 / 180 * Math.PI;
        var lambda0 = long0 / 180 * Math.PI;
        var lambda1 = long1 / 180 * Math.PI;
        var deltaPhi = phi1 - phi0;
        var deltaLambda = lambda1 - lambda0;
        var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi0) * Math.cos(phi1) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return r * c;
    }

    function addPoints(points) {
        console.log('Add points', points);
        if ($scope.speedProgress >= 80 && $scope.brakingProgress >= 80 && $scope.accelerationProgress >= 80) {
            $scope.points += 2 * points;
        } else {
            $scope.points += points;
        }
        $scope.$apply();
    }
}