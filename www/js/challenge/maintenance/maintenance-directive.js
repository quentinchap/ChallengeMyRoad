angular.module('starter.challenges')
.directive('ecMaintenance', ['maintenanceService', 
function (maintenanceService) {
    
    return {
        templateUrl: '/js/challenge/maintenance/maintenance.html'
    };
}]);
