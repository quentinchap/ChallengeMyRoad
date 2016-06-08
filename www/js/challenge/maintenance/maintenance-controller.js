angular.module('starter.challenges', []).controller('MaintenanceCtrl', MaintenanceCtrl);

//MaintenanceCtrl.$inject = [/*'$stateParams','maintenanceService'*/];
function MaintenanceCtrl(/*$stateParams, /*maintenanceService*/) {
    var vm = this;

    //vm.challenge = maintenanceService.read($stateParams.challengeId);
    
    vm.challenge = {
        idChallenge: 1,
        title: 'Pression des pneus',
        detail: 'Diminution adhérence + Augmentation conso + durée de vie des pneus réduite',
        gain: 50,
        challengeUser: {
            idUser: 1,
            idChallenge: 1,
            state: 0
        }
    };

    vm.challengeIcon = vm.challenge.challengeUser.state == 0?'highlight_off':'check_circle';
    vm.challengeIconColor = vm.challenge.challengeUser.state == 0?'challenge-ko':'challenge-ok';
}

