/* global angular */
'use strict';

angular
  .module('centrosModule', ['ngRoute'])
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/centros', {
          templateUrl: 'centros/centros.html',
          controller: 'CentrosController'
        })
        .when('/centros/:id', {
          templateUrl: 'centros/centro.html',
          controller: 'CentroController'
        });
    }
  ])
  .factory('centrosFactory', ['$http'
    , function ($http) {
      return {
        get: function () {
          return $http({
            method: 'GET',
            isArray: true,
            url: '/api/centros',
          });
        },
        getId: function (id) {
          return $http({
            method: 'GET',
            isArray: false,
            url: '/api/centros/' + id,
          });
        },
        update: function (id, centro) {
          if (id > 0) {
            return $http.put('/api/centros/' + id, { centro: centro });

          } else {
            return $http.post('/api/centros/' + id, { centro: centro });

          }
        }
      };
    }])
  .controller('CentrosController', [
    '$scope',
    'centrosFactory',
    function ($scope, centrosFactory) {
      $scope.centros = [];
      centrosFactory.get()
        .then(function (response) {
          $scope.centros = response.data;
        }, function (error) {
          $scope.c = error.status;
        });
    }
  ])
  .controller('CentroController', [
    '$scope',
    'centrosFactory',
    '$routeParams',
    '$location',
    function ($scope, centrosFactory, $routeParams, $location) {
      $scope.centro = undefined;
      // Obtener el registro.
      centrosFactory.getId($routeParams.id).then(function (response) {
        $scope.centro = response.data;
      }, function (error) {
        $scope.c = error.data;
      });

      // Grabación de la ficha.
      $scope.submit = function () {
        if ($scope.centro) {
          centrosFactory.update($scope.centro.idcentros, $scope.centro)
            .then(function (datos) {
              //centrosFactory.getCentro(datos.data.idcentros);
              $scope.centro = datos.data;
              $scope.msg = undefined;
              if ($routeParams.id && $routeParams.id <= 0
                && $scope.centro && $scope.centro.idcentros > 0) {
                $routeParams.id = $scope.centro.idcentros;
              }

              if (datos.data.msg) {
                $scope.msg = datos.data.msg;
                $scope.msg.ahora = new Date();
              }
            }, function (error) {
              $scope.c = error.data;
            });
        }
      };
    }
  ]);
