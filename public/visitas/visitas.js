/* global angular */
'use strict';

angular
  .module('visitasModule', ['ngRoute'])
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider.
        when('/visitas', {
          templateUrl: 'visitas/visitas.html',
          controller: 'VisitasController'
        });
    }
  ])
  .controller('VisitasController', [
    '$scope',
    '$http',
    function ($scope) {
      console.log('El VisitasController se ejecuta');
      $scope.visitas = [
        {
          fecha: "2015-09-15",
          asunto: "Visita de reconocimiento",
          objetivo: "Visita realizada para contactar con el monitor",
          idUsuarios: 1,
          centro: {
            centro: "Colegio público \"el cole\"",
            direccion: "calle el coco nº 45",
            poblacion: "Ronda",
            codpos: "29400",
            provincia: "Málaga",
            email: null,
            telefono: "952888999",
            movil: null
          }
        },
        {
          fecha: "2015-09-22",
          asunto: "Visita de reconocimiento y presentación",
          objetivo: null,
          idUsuarios: 2,
          centro: {
            centro: "Residencia escolar \"la cabaña\"",
            direccion: "calle rocio nº 9",
            poblacion: "Cortes de la Frontera",
            codpos: "29380",
            provincia: "Málaga",
            email: null,
            telefono: "952888988",
            movil: null
          }
        },
        {
          fecha: "2015-09-29",
          asunto: "Vista de reconocimiento y presentación",
          objetivo: null,
          idUsuarios: 1,
          centro: {
            centro: "Comedor escolar \"la taberna\"",
            direccion: "calle rocio nº 11",
            poblacion: "Cortes de la Frontera",
            codpos: "29380",
            provincia: "Málaga",
            email: null,
            telefono: "952888997",
            movil: null
          }
        }
      ];
  }]);