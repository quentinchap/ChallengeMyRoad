angular.module('starter.progress-bars')
    .controller('ProgressBarsCtrl', ProgressBarCtrl);

ProgressBarCtrl.$inject = ['$scope'];
function ProgressBarCtrl($scope) {
    $scope.foo = 'bar';
}