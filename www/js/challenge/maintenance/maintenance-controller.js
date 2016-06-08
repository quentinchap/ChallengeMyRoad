angular.module('starter.challenges', []).controller('MaintenanceCtrl', MaintenanceCtrl);

MaintenanceCtrl.$inject = [/*'$stateParams',*/'maintenanceService'];
function MaintenanceCtrl(/*$stateParams, */maintenanceService) {
    var vm = this;

    vm.challenge = maintenanceService.read(1);
    /*
    vm.challenge = {
        "idChallenge" : 2,
        title: 'Pression des pneus',
        detail: 'Diminution adhérence + Augmentation conso + durée de vie des pneus réduite',
        gain: 50,
        "goalType" : "OK/KO",
        "goalValue" : "OK",    
        type: 'maintenance',
        challengeUser: {
            idUser: 1,
            idChallenge: 1,
            display: true,
            state: 0
        }
    };*/

    vm.displayChallenge = vm.challenge.challengeUser.display ? 'block' : 'none';
    if (vm.challenge.challengeUser.state === 0) {
        vm.challengeIcon = 'highlight_off';
    } else {
        vm.challengeIcon = 'check_circle';
    }
    
    vm.ok = function () {
        vm.challenge.challengeUser.state = 1;
        vm.challengeIcon = 'check_circle';
    };
    
    vm.later = function () {
        vm.challenge.challengeUser.display = false;
    };
}

