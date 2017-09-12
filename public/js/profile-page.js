var app = angular.module("main",[]);
app.controller("main-ctrl", function($scope,$http){
    $scope.pw = '';
    $scope.oldpw='';
    $scope.pw2='';
    $scope.icon='';
    $scope.passwordError = false;
    $scope.changeApplied = false;
    $scope.alterIcon = function(){
        $http.post('/profile/alter',{oldPassword : '',　newPassword :'', newPassword2:'', newIcon:$scope.icon})
        .success(function(res){
            $scope.changeApplied = true;
        }).error(function(res){
            $scope.passwordError = true;
        })
    };
    $scope.alterPassword = function(){
        $http.post('/profile/alter',{oldPassword : $scope.oldpw,　newPassword :$scope.pw, newPassword2:$scope.pw2, newIcon:''})
        .success(function(res){
            $scope.changeApplied = true;
        });
    }
});