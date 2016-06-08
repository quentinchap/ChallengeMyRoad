angular.module('starter.challenges', []).controller('MaintenanceCtrl', MaintenanceCtrl);

//MaintenanceCtrl.$inject = [/*'$stateParams','maintenanceService'*/];
function MaintenanceCtrl(/*$stateParams, /*maintenanceService*/) {
    var vm = this;

    //vm.challenge = maintenanceService.read($stateParams.challengeId);
    
    vm.challenge = {
        //id: $stateParams.challengeId,
        title: 'Anticiper les obstacles',
        detail: 'Afin de mieux anticiper les obstacles, vous devez réduire les freinages brusques de 10%.',
        progress: 8
    };
}

