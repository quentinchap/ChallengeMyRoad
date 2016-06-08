angular.module('starter.service', [])
.factory('challengeService', function() {

  var service = {
    getThreeRightChallenge:getThreeRightChallenge
  }

  return service;

  function getThreeRightChallenge()
  {
    return { title: "challenge 1"}
  }


})
