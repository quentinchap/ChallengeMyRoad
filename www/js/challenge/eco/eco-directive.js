angular.module('starter.challenges', [])
    .directive('ecoChallenge', ecoChallenge);


function ecoChallenge() {
  return {
    templateUrl: 'js/challenge/eco/eco.html'
  };
};
