'use strict';

var nombreAplicacion = "visitas"
var appAngular = angular.module(nombreAplicacion, ['ngRoute', 'ngResource', 'users']);

appAngular.controller('visitasController', [
    '$scope', 
    '$routeParams',
    'Authentication', 
    function ($scope, $routeParams, Authentication) {
        $scope.nombreApp = "Visitas 0.1";
        $scope.usuario = "usuario no descargado";
        $scope.user = undefined;
        Authentication.get().$promise.then(function (res) {
            $scope.user = res;
            $scope.usuario = $scope.user.displayName ? $scope.user.displayName: ($scope.user.username ? $scope.user.username: $scope.user.email);
        });

        

    }
]);


