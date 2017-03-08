angular.module('MainCtrl',[]).controller('MainController',function($scope,MainService) {
    $scope.getData = function(){
        MainService.get.then(function(data){
            console.log(data);
            $scope.currentuser = data.user;
        });
    };
        
    $scope.getData();
});