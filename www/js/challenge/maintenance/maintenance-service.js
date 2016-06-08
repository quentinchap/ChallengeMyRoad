angular.module('starter.challenges').service('maintenanceService', function ($firebaseArray){

  this.readAll = function () {
      var ref = firebase.database().ref().child("challenge");
      var fbArray = $firebaseArray(ref);
      console.log(fbArray.length);
      return fbArray;
  };

});
