angular.module('starter.progress-bars')
    .directive('ecProgressBars', function () {
        return {
            templateUrl: './js/progress-bars/progress-bars.tmpl.html',
            controller: 'progressBarCtrl'
        };
    }).controller('progressBarCtrl',function ($scope) {

        $scope.getColor = getColor;

        function getColor(val) {
          if(val <= 33)
          {
            return 'rouge';
          }
          else if( val >= 66) {
            return 'vert';
          }
          else {
            return 'orange';
          }
        }
    });
