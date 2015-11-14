'use strict';

var appAngular = angular
  .module('visitasApp', [
    'ngRoute',
    'ngResource',
    'ngLocale',
    'usersModule',
    'visitasModule'
  ])
// Enrutador
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider.otherwise({
        redirectTo: '/visitas'
      });

      $locationProvider.html5Mode(false);

    }
  ])
  .controller('AppController', [
    '$scope',
    'Authentication',
    function ($scope, Authentication) {
      $scope.nombreApp = "Visitas 0.1";
      $scope.usuario = "usuario no descargado";
      $scope.user = undefined;
      Authentication.get().$promise.then(function (res) {
        $scope.user = res;
        $scope.usuario = $scope.user.displayName ? $scope.user.displayName : ($scope.user.username ? $scope.user.username : ($scope.user.fb_name ? $scope.user.fb_name : $scope.user.email));
      });
    }
  ]);


