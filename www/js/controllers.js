angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $firebaseArray, $mdSidenav) {
    var ref = firebase.database().ref().child("challenge");
    $scope.messages = $firebaseArray(ref);

    $scope.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };
  });
