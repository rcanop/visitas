/* global angular */
'use strict';

angular
  .module('empleadosModule', ['ngRoute'])
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/empleados', {
          templateUrl: 'empleados/empleados.html',
          controller: 'EmpleadosController'
        })
        .when('/empleados/:id', {
          templateUrl: 'empleados/empleado.html',
          controller: 'EmpleadoController'
        });
    }
  ])
  .factory('empleadosFactory', ['$http'
    , function ($http) {
      return {
        get: function () {
          return $http({
            method: 'GET',
            isArray: true,
            url: '/api/empleados',
          });
        },
        getId: function (id) {
          return $http({
            method: 'GET',
            isArray: false,
            url: '/api/empleados/' + id,
          });
        },
        update: function (id, empleado) {
          if (id > 0) {
            return $http.put('/api/empleados/' + id, { empleado: empleado });

          } else {
            return $http.post('/api/empleados/' + id, { empleado: empleado });

          }
        }
      };
    }])
  .controller('EmpleadosController', [
    '$scope',
    'empleadosFactory',
    function ($scope, empleadosFactory) {
      $scope.empleados = [];
      empleadosFactory.get()
        .then(function (response) {
          $scope.empleados = response.data;
        }, function (error) {
          $scope.c = error.status;
        });
    }
  ])
  .controller('EmpleadoController', [
    '$scope',
    'empleadosFactory',
    '$routeParams',
    '$location',
    function ($scope, empleadosFactory, $routeParams, $location) {
      $scope.empleado = undefined;
      $scope.situacion = [
        {
          valor: null,
          descrip: 'Desconocida'
        },
        {
          valor: 'TEMPORAL',
          descrip: 'Temporal'
        },
        {
          valor: 'FIJA',
          descrip: 'Fija o Indefinida'
        }
      ]
      $scope.tipoEmpleado = [
        {
          valor: null,
          descrip: 'Seleccione',
          grupos: [
            {
              valor: null,
              descrip: 'No existen'
            }
          ]
        },
        {
          valor: 'ESTATUTARI',
          descrip: 'Estatutario',
          grupos: [
            {
              valor: null,
              descrip: 'No existen'
            }
          ]
        },
        {
          valor: 'FUNCIONARI',
          descrip: 'Funcionario',
          grupos: [
            {
              valor: null,
              descrip: 'Desconocido'
            },
            {
              valor: 'A1',
              descrip: 'A1 Grado universitario'
            },
            {
              valor: 'A2',
              descrip: 'A2 Grado universitario'
            },
            {
              valor: 'B',
              descrip: 'Técnico superior'
            },
            {
              valor: 'C1',
              descrip: 'Bachiller o Técnico'
            },
            {
              valor: 'C2',
              descrip: 'Educación secundaria obligatoria'
            }
          ]
        },
        {
          valor: 'DOCENTES',
          descrip: 'Funcionario docente',
          grupos: [
            {
              valor: null,
              descrip: 'Desconocido'
            },
            {
              valor: 'A1',
              descrip: 'A1 Grado universitario'
            },
            {
              valor: 'A2',
              descrip: 'A2 Grado universitario'
            },
            {
              valor: 'B',
              descrip: 'Técnico superior'
            },
            {
              valor: 'C1',
              descrip: 'Bachiller o Técnico'
            },
            {
              valor: 'C2',
              descrip: 'Educación secundaria obligatoria'
            }
          ]
        },
        {
          valor: 'LABORAL',
          descrip: 'Laboral',
          grupos: [
            {
              valor: null,
              descrip: 'Desconocido'
            },
            {
              valor: 'I',
              descrip: 'Grado universitario'
            },
            {
              valor: 'II',
              descrip: 'Grado universitario'
            },
            {
              valor: 'III',
              descrip: 'Técnico superior'
            },
            {
              valor: 'IV',
              descrip: 'Bachiller o Técnico'
            },
            {
              valor: 'V',
              descrip: 'Educación secundaria obligatoria'
            }
          ]
        }
      ];
      $scope.grupo = [];

      $scope.obtenerGrupo = function () {
        $scope.grupo = [];

        $scope.tipoEmpleado.forEach(function (tipoEmpleado) {
          if (tipoEmpleado.valor === $scope.empleado.tipo) {
            var llValor = false;
            $scope.grupo = tipoEmpleado.grupos;
            $scope.grupo.forEach(function (grupo) {
              if (!llValor && $scope.empleado.grupo) {
                llValor = (grupo.valor === $scope.empleado.grupo);
              }
            });
            if (!llValor) {
              $scope.empleado.grupo = null;
            }
          }
        });
        console.log($scope.grupo);

      };

      // Obtener el registro.
      empleadosFactory.getId($routeParams.id).then(function (response) {
        $scope.empleado = response.data;
        if (!$scope.empleado.tipo) {
          $scope.empleado.tipo = null;
          $scope.empleado.grupo = null;
        }
        if (!$scope.empleado.grupo) {
          $scope.empleado.grupo = null;
        }

        $scope.obtenerGrupo();
      }, function (error) {
        $scope.c = error.data;
      });

      // Grabación de la ficha.
      $scope.submit = function () {
        if ($scope.empleado) {
          empleadosFactory.update($scope.empleado.idempleados, $scope.empleado)
            .then(function (datos) {
              $scope.empleado = datos.data;
              $scope.msg = undefined;
              if ($routeParams.id && $routeParams.id <= 0
                && $scope.empleado && $scope.empleado.idempleados > 0) {
                $routeParams.id = $scope.empleado.idempleados;
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
