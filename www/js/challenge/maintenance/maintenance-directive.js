angular.module('starter.challenges')
.directive('ecMaintenance', 
function () {
    this.ok = function () {
        state = 1;
        icon = 'check_circle';
    };

    this.later = function () {
        display = false;
    };
    return {
        restrict:'E',
        scope: {         
            title: '@',
            display: '@',
            detail: '@',
            state: '@',
            icon: '@',
            gain: '@', 
            type: '@',
            challengeid: '@'
        },        
        templateUrl: '/js/challenge/maintenance/maintenance.html'
    };
});
