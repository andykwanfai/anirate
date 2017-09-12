      if(false || !!document.documentMode) //IF IE
      {
            alert('咪用IE啦屌你'); 
      } 
      var app = angular.module("main",[]);
      app.controller ("timeTable",function($scope,$http){
            // hold the anime objects in different weekday
            $scope.followMode = false;
            
            $scope.user_id = '';
            $scope.anime = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
            // convert date in sql formatt to js formatt and return the weekday its airs
            $scope.getWeekDay = function (anime) {
                  var t = anime.on_air_date.replace('T',' ').replace('Z',' ').split(/[- :]/);
                  var onAir;
                  
                  onAir = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                  onAir.setHours(onAir.getHours() + 8);
                  //console.log(onAir);
                  return onAir.getDay();
            };
            // sort anime according to its on air weekday
            $scope.sortAnime = function(res){
                  var anime_raw = res;
                  for(var i = 0 ; i < anime_raw.length ; i++){
                        var arr = $scope.anime[$scope.getWeekDay(anime_raw[i])];
                        arr[arr.length] = anime_raw[i];
                  }
                  //console.log(JSON.stringify($scope.anime));
            };
            // return a current season string used to sort anime
            $scope.getCurrentSeasonList = function(){
                  $http.post('/season/current').success(function(res){
                        $scope.sortAnime(res);
                  });
            };
            $scope.getUserSession = function(){
                  $http.get('/session').success(function(res){
                  if(res != null){
                        $scope.user_id = res.substr(1,res.length-2);
                  }else
                        $scope.user_id = "";
            });
            };
            $scope.getUserSession();
            $scope.getCurrentSeasonList();
            
      });
      