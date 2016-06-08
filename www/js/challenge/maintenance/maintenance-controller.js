angular.module('starter.challenges', []).controller('MaintenanceCtrl', MaintenanceCtrl);

MaintenanceCtrl.$inject = [/*'$stateParams',*/ '$rootScope', 'maintenanceService'];
function MaintenanceCtrl(/*$stateParams,*/ $rootScope, maintenanceService) {
    var vm = this;

    //$rootScope.challenges = maintenanceService.readAll();
    
    vm.challenges = $rootScope.challenges;

    if ($rootScope.challenges !== null) {
        console.log($rootScope.challenges.length);
        for (var i = 0; i < $rootScope.challenges.length; i++) {
            if ($rootScope.challenges[i].challengeUser.state === 0) {
                $rootScope.challenges[i].challengeUser.challengeIcon = 'highlight_off';
            } else {
                $rootScope.challenges[i].challengeUser.challengeIcon = 'check_circle';
            }
            
        }

    }
    
    
    vm.done = function (id) {
        for (var i = 0; i < $rootScope.challenges.length; i++) {
            if ($rootScope.challenges[i].idChallenge == id) {
                $rootScope.challenges[i].challengeUser.state = 1;
                $rootScope.challenges[i].challengeUser.challengeIcon = 'check_circle';
            }
        }
    };

    vm.later = function (id) {
        for (var i = 0; i < $rootScope.challenges.length; i++) {
            if ($rootScope.challenges[i].idChallenge == id) {            
                $rootScope.challenges[i].challengeUser.display = false;
            }
        }
    };
}

