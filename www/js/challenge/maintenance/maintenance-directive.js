angular.module('starter.challenges', [])
    .directive('maintenanceChallenge', maintenanceChallenge);


function maintenanceChallenge() {
  return {
    templateUrl: 'js/challenge/maintenance/maintenance.html'
  };
};
