// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngMaterial','ngCordovaOauth' 'starter.controllers', 'firebase', 'starter.sensors', 'starter.challenges', 'starter.progress-bars'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login',{
        url: '/login',
        authenticate: false,
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('app', {
        url: '/app',
        abstract: true,
        authenticate: false,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.sensors', {
        url: '/sensors',
        authenticate: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/sensors.html',
            controller: 'SensorsCtrl'
          }
        }
      })
      .state('app.store', {
        url: '/store',
        authenticate: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/store.html',
            controller: 'StoreCtrl'
          }
        }
      })
    .state('app.challenges', {
        url: '/challenges',
        authenticate: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/challenge.html',
            controller: 'MaintenanceCtrl'
          }
        }
      })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  })

  .config(function themeConfiguration($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('light-green')
      .warnPalette('orange')
  });
