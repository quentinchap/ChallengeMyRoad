angular.module('starter.sensors')
    .controller('SensorsCtrl', SensorsCtrl);

SensorsCtrl.$inject = ['$interval', '$rootScope', 'sensorsService', 'speedLimitsService', 'maintenanceService'];
function SensorsCtrl($interval, $rootScope, sensorsService, speedLimitsService, maintenanceService) {

    if (!$rootScope.sensorsInitialized) {

        $rootScope.challenges = [{
            idChallenge: 1,
            title: "Réduire sa vitesse",
            detail: "Réduisez votre vitesse moyenne de 5 km/h sur ce trajet.",
            gain: 100,
            goalCriteria: "<=",
            goalType: "km/h",
            goalValue: 80,
            type: "navigation",
            icon: "mdi mdi-speedometer",
            challengeUser: {
                idUser: 1,
                display: 1,
                state: 0
            }
        },

            {
                idChallenge: 2,
                title: "Adapter votre conduite",
                detail: "Adapter votre vitesse au temps pluvieux.",
                gain: 50,
                goalType: "OK/KO",
                goalValue: "OK",
                type: "meteo bad",
                icon: "mdi mdi-weather-pouring",
                challengeUser: {
                    idUser: 1,
                    display: 1,
                    state: 0
                }

            },
            {
                idChallenge: 3,
                title: "Pression des pneus",
                detail: "Veuilez effectuer la pression des pneus.",
                gain: 50,
                goalType: "OK/KO",
                goalValue: "OK",
                type: "navigation",
                icon: "mdi mdi-car",
                challengeUser: {
                    idUser: 1,
                    display: 1,
                    state: 0
                }

            },

            {
                idChallenge: 4,
                title: "Kilométrage du véhicule",
                detail: "Veuilez indiquer le kilométrage du véhicule.",
                gain: 50,
                goalType: "OK/KO",
                goalValue: "OK",
                type: "navigation",
                icon: "mdi mdi-pencil-box-outline",
                challengeUser: {
                    idUser: 1,
                    display: 1,
                    state: 0
                }
            },
            {
                idChallenge: 5,
                title: "Conduite souple",
                detail: "Eviter les freinages, les ralentissements et utiliser le frein moteur permet un gain de carburant de 40%.",
                gain: 50,
                goalType: "OK/KO",
                goalValue: "OK",
                type: "navigation",
                icon: "mdi mdi-tree",
                challengeUser: {
                    idUser: 1,
                    display: 1,
                    state: 0
                }
        ];

        console.log("Init");
        $rootScope.sensorsInitialized = true;
        $rootScope.loaded = false;

        $rootScope.coordinates = {
            latitude: undefined,
            longitude: undefined,
            altitude: undefined
        };
        $rootScope.speed = undefined;
        $rootScope.acceleration = {
            x: undefined,
            y: undefined,
            z: undefined
        };
        $rootScope.accuracy = undefined;

        $rootScope.points = 0;
        $rootScope.speedProgress = 50;
        $rootScope.brakingProgress = 50;
        $rootScope.accelerationProgress = 50;
        $rootScope.displayedSpeedProgress = 50;
        $rootScope.displayedBrakingProgress = 50;
        $rootScope.displayedAccelerationProgress = 50;
        $rootScope.distance = 0;

        $rootScope.temperature = undefined;
        $rootScope.pressure = undefined;
        $rootScope.humidity = undefined;
        $rootScope.windSpeed = undefined;

        $rootScope.speedLimit = 13.8;

        var pointsUpdateThreshold = 100;

        var speedLimitIncrement = 1;
        var speedLimitDecrement = 10;

        $rootScope.accelerationSpeedThreshold = 5;
        $rootScope.accelerationIntensityThreshold = -2;
        $rootScope.accelerationIncrement = 0.05;
        $rootScope.accelerationDecrement = 1.0;

        $rootScope.brakingSpeedThreshold = 5;
        $rootScope.brakingIntensityThreshold = 5;
        $rootScope.brakingIncrement = 0.05;
        $rootScope.brakingDecrement = 1.0;

        $rootScope.overrideSpeedLimit = true;
        $rootScope.speedLimitOverride = 13.8;

        initialize();
    }

    function initialize() {
        registerPositionListener();
        registerAccelerationListener();
        registerWeatherListener();
        registerSpeedLimitListener();
        $rootScope.loaded = true;
        $interval(function () {
            $rootScope.displayedSpeedProgress = $rootScope.speedProgress;
            $rootScope.displayedBrakingProgress = $rootScope.brakingProgress;
            $rootScope.displayedAccelerationProgress = $rootScope.accelerationProgress;
        }, 100);
    }

    function registerPositionListener() {
        navigator.geolocation.watchPosition(
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
        $interval(updateWeather, 60 * 1000);
    }

    function registerSpeedLimitListener() {
        $interval(updateSpeedLimit, 30 * 1000);
    }

    function onPositionError(err) {
        console.error('Failed to retrieve position', err);
    }

    function onPositionUpdate(position) {
        var positionUndefined = undefined === $rootScope.coordinates.latitude;
        if (!positionUndefined) {
            var dist = distance($rootScope.coordinates.latitude, $rootScope.coordinates.longitude, position.coords.latitude, position.coords.longitude);
            console.log(dist);
            if ($rootScope.distance % pointsUpdateThreshold < pointsUpdateThreshold && ($rootScope.distance % pointsUpdateThreshold) + dist >= pointsUpdateThreshold) {
                var points = ((($rootScope.distance % pointsUpdateThreshold) + dist) / pointsUpdateThreshold) | 0;
                addPoints(points);
            }
            $rootScope.distance += dist;
        }
        $rootScope.coordinates.latitude = position.coords.latitude;
        $rootScope.coordinates.longitude = position.coords.longitude;
        $rootScope.coordinates.altitude = position.coords.altitude;
        $rootScope.speed = position.coords.speed;
        $rootScope.accuracy = position.coords.accuracy;
        updateSpeedProgress();
        if (positionUndefined) {
            updateSpeedLimit();
        }
    }

    function onAccelerationUpdate(event) {
        var acceleration = event.acceleration;
        if (null === acceleration.x) {
            acceleration = event.accelerationIncludingGravity;
        }
        $rootScope.acceleration.x = acceleration.x;
        $rootScope.acceleration.y = acceleration.y;
        $rootScope.acceleration.z = acceleration.z;
        updateBrakingProgress();
        updateAccelerationProgress();
    }

    function updateWeather() {
        sensorsService.getWeatherConditions($rootScope.coordinates)
            .then(function (weather) {
                $rootScope.temperature = weather.data.main.temp;
                $rootScope.pressure = weather.data.main.pressure;
                $rootScope.humidity = weather.data.main.humidity;
                $rootScope.windSpeed = weather.data.wind.speed;
            });
    }

    function updateSpeedLimit() {
        speedLimitsService.getSpeedLimitAtPosition($rootScope.coordinates, $rootScope.accuracy)
            .then(function (speedLimit) {
                if ($rootScope.overrideSpeedLimit) {
                    $rootScope.speedLimit = $rootScope.speedLimitOverride;
                    return;
                }
                $rootScope.speedLimit = undefined !== speedLimit ? speedLimit / 3.6 : undefined;
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
        if ($rootScope.speedProgress >= 80 && $rootScope.brakingProgress >= 80 && $rootScope.accelerationProgress >= 80) {
            $rootScope.points += 2 * points;
        } else {
            $rootScope.points += points;
        }
    }

    function updateSpeedProgress() {
        if ($rootScope.speed > $rootScope.accelerationSpeedThreshold / 3.6) {
            if (undefined !== $rootScope.speedLimit) {
                if ($rootScope.speed < $rootScope.speedLimit) {
                    $rootScope.speedProgress += speedLimitIncrement;
                } else {
                    $rootScope.speedProgress -= speedLimitDecrement;
                }
            }
            if ($rootScope.speedProgress < 0) {
                $rootScope.speedProgress = 0;
            } else if ($rootScope.speedProgress > 100) {
                $rootScope.speedProgress = 100;
            }
        }
    }

    function updateBrakingProgress() {
        if ($rootScope.speed > $rootScope.brakingSpeedThreshold / 3.6) {
            if ($rootScope.acceleration.z <= $rootScope.brakingIntensityThreshold && $rootScope.acceleration.z >= $rootScope.accelerationIntensityThreshold) {
                $rootScope.brakingProgress += $rootScope.brakingIncrement;
            } else if ($rootScope.acceleration.z > $rootScope.brakingIntensityThreshold) {
                $rootScope.brakingProgress -= $rootScope.brakingDecrement;
            }
        }
        if ($rootScope.brakingProgress < 0) {
            $rootScope.brakingProgress = 0;
        } else if ($rootScope.brakingProgress > 100) {
            $rootScope.brakingProgress = 100;
        }
    }

    function updateAccelerationProgress() {
        if ($rootScope.speed > $rootScope.accelerationSpeedThreshold / 3.6) {
            if ($rootScope.acceleration.z <= $rootScope.brakingIntensityThreshold && $rootScope.acceleration.z >= $rootScope.accelerationIntensityThreshold) {
                $rootScope.accelerationProgress += $rootScope.accelerationIncrement;
            } else if ($rootScope.acceleration.z < $rootScope.accelerationIntensityThreshold) {
                $rootScope.accelerationProgress -= $rootScope.accelerationDecrement;
            }
        }
        if ($rootScope.accelerationProgress < 0) {
            $rootScope.accelerationProgress = 0;
        } else if ($rootScope.accelerationProgress > 100) {
            $rootScope.accelerationProgress = 100;
        }
    }
}
