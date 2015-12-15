/* global angular */
'use strict';

angular
  .module('visitasModule', ['ngRoute'])
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/visitas', {
          templateUrl: 'visitas/visitas.html',
          controller: 'VisitasController'
        });
    }
  ])
  .controller('VisitasController', [
    '$scope',
    '$http',
    function ($scope, $http) {
      console.log('El VisitasController se ejecuta');
      $scope.visitas = [];
      $http({
        method: 'GET',
        isArray: true,
        url: '/model/visitas'
      }).then(function (datos) {
        $scope.visitas = datos || [];
      });
    }
  ]);
