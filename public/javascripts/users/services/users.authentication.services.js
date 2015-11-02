angular.module('users').factory('Authentication', ['$resource',
    function ($resource) {
        return $resource('/users/current', 
                {}, {
            get: { method: 'GET', isArray: false }
        });
    }]);

