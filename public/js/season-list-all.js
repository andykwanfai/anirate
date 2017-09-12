var app = angular.module("main",[]);
app.controller("all", function($scope,$http){
    $scope.animeList = [];
    $scope.fetchData = [];// boolean , monitor if data is already fetched under this tab
    $scope.expandSeason = function(season_name){
        if(!$scope.fetchData[season_name]){
            var url = '/season/request/' + season_name;
            //console.log(url);
            $http.get(url).success(function(res){
                $scope.animeList[season_name] = res;
                $scope.fetchData[season_name] = true;
           });
        }
    }
});

$(document).ready(function(){
    $('input.expand').click(function(){
        if(this.value == '+'){
            $(this).val('-');
            if($(this).parent().next('.season-list').children().length > 1)
                $(this).parent().next('.season-list').slideDown(300);
            else{
                $(this).parent().next('.season-list').hide();
                $(this).parent().next('.season-list').delay(300).slideDown(300);
            }
        }else{
            this.value = '+';
            $(this).parent().next('.season-list').slideUp(300);
        }
    });
});