angular.module('FolderService',[]).factory('FolderService',function($http,$routeParams) {
    var id = $routeParams.id;
    return {
        get: (function(response) {
            return $http.get('/api/folder/'+id)
            .then(function(response) {
              return response.data;
            });
        })()
    };
});
