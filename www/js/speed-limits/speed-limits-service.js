angular.module('starter.speed-limits')
    .factory('speedLimitsService', speedLimitsService)
    .constant('SpeedLimits', {
        residential: 30,
        urban: 50,
        rural: 90,
        trunk: 110,
        motorway: 130
    });

speedLimitsService.$inject = ['$http', '$q', 'SpeedLimits'];
function speedLimitsService($http, $q, SpeedLimits) {

    var service = {
        getSpeedLimitAtPosition: getSpeedLimitAtPosition
    };

    return service;

    /**
     * Get speed limit at given position. HIGHLY EXPERIMENTAL.
     * @param {Object} position - GPS position.
     * @param {number} precision - GPS "precision", will try to locate road in this radius.
     * @returns {Promise} 
     */
    function getSpeedLimitAtPosition(position, precision) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: 'http://www.overpass-api.de/api/interpreter',
            data: '[out:json];way["highway"~"."](around:' + precision + ',' + position.latitude + ',' + position.longitude + ');out geom;'
        }).then(function (response) {
            var results = response.data.elements;
            if (undefined === results || 0 === results.length) {
                deferred.resolve(undefined);
                return;
            }
            for (var index = 0, length = results.length; index < length; ++index) {
                var result = results[index];
                var tags = result.tags;
                if (undefined === tags) {
                    continue;
                }
                if (undefined !== tags.maxspeed) {
                    deferred.resolve(parseInt(tags.maxspeed));
                    return;
                }
                if (undefined !== tags.highway) {
                    deferred.resolve(SpeedLimits[tags.highway]);
                    return;
                }
                deferred.resolve(undefined);
            }
        }, function (response) {
            console.error('Failed to get speed limits from http://www.overpass-api.de/api/interpreter');
            deferred.resolve(undefined);
        });

        return deferred.promise;
    }
}