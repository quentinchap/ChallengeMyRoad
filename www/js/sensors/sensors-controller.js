angular.module('starter.sensors')
    .controller('SensorsCtrl', SensorsCtrl);

SensorsCtrl.$inject = ['$interval', '$scope', 'sensorsService', 'speedLimitsService'];
function SensorsCtrl($interval, $scope, sensorsService, speedLimitsService) {

    $scope.loaded = true;
}