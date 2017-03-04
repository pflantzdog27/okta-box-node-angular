angular.module('FolderCtrl',[]).controller('FolderController',function($scope,FolderService,$window) {
    $scope.folderName = 'Files';
    $scope.getData = function(){
        FolderService.get.then(function(data){
            console.log(data)
            $scope.files = data.files;
        });
    };
    
    $scope.go = function ( path, name ) {
        $window.location.href = '/folder/'+path;
        $scope.folderName = name;
    };
    
    $scope.getData();
});