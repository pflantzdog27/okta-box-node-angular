angular.module('FolderCtrl',[]).controller('FolderController',function($scope,FolderService,$window) {
    $scope.getData = function(){
        FolderService.get.then(function(data){
            console.log(data)
            $scope.files = data.files;
        });
    };
    
    $scope.getData();
    
    $scope.go = function ( path, name ) {
        $window.location.href = '/folder/'+path;
    };
});