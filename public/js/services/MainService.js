angular.module('MainService',[]).factory('MainService',function($http) {
    return {
        get: (function(response) {
            return $http.get('/api/user')
            .then(function(response) {
              return response.data;
            });
        })()
    };
});
