angular.module('appRoutes',[]).config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    })
    .when('/folder/:id', {
        templateUrl: 'views/folder.html',
        controller: 'FolderController'
    })
    .otherwise('/');
    
    $locationProvider.html5Mode(true);
}]);