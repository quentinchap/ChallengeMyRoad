angular.module('starter.controllers')

  .controller('HomeCtrl', function () {
    var vm = this;

    vm.jauge = {};
    vm.jauge.vitesse = 50;
    vm.jauge.acceleration = 80;
    vm.jauge.frein = 30;

    vm.getJaugeColor= getJaugeColor;

    function getJaugeColor(value) {
      if(value > 50)
      {
        return 'okResult';
      }
      if(value <= 50 && value > 30) {
        return 'midResult';

      }
      else {
        return 'badResult';
      }

    }

  });
