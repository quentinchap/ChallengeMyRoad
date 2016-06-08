angular.module('starter.challenges', []).controller('ChallengesCtrl', ChallengesCtrl);

ChallengesCtrl.$inject = ['$stateParams'/*'challengesService'*/]
function ChallengesCtrl($stateParams/*challengesService*/) {
    var vm = this;

    //vm.challenge = challengesService.read($stateParams.challengeId);
    
    vm.challenge = {
        id: $stateParams.challengeId,
        title: 'Anticiper les obstacles',
        detail: 'Afin de mieux anticiper les obstacles, vous devez réduire les freinages brusques de 10%.',
        progress: 8
    };
}
