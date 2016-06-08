angular.module('starter.challenges').service('maintenanceService', function ($firebaseArray){

  this.readAll = function () {
      var ref = firebase.database().ref().child("challenge");
      return $firebaseArray(ref);
  };

  this.read = function (id) {
      var challenges = this.readAll();
      return challenges.$getRecord(id);
  };
});
