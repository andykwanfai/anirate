
app.controller ("headerCtrl",function($scope,$http){
    $scope.username = '';
    $scope.currentSeason = [];
    $scope.searchOptions = [
        {id:0,name:'動畫'},
        {id:1,name:'聲優'},
        {id:2,name:'Staff'},
    ];
    $scope.selectedSearchOption = {};
    $scope.searchStr= '';
    $scope.showProfile = false;
    $scope.usericon = '';
    $scope.getUserSession = function(){
        $http.get('/session').success(function(res){
            if(res != null){
              $scope.username = res.substr(1,res.length-2);
              $http.get('/get_user_info').success(
                  function(res){
                      $scope.usericon = res.icon;
                      //console.log("ICON:" +JSON.stringify(res.icon));
                  }
            );
            }else
              $scope.username = "";
            });
     };
    $scope.getCurrentSeason = function(){
        for(var i = 0 ; i < 4 ;i++){
            var date=new Date();
            date.setMonth(date.getMonth() + 3 + i * -3);
            $scope.currentSeason[3-i] = {date : date,datestring:toString(date),dateurl:toUrl(date)};
        }
        //console.log(JSON.stringify($scope.currentSeason));
    };
    $scope.getUserSession();
    $scope.getCurrentSeason(); 
    
});


function onHover(img){
    img.src='/img/search blue.png';
}

function onLeave(img){
    img.src='/img/search.png';
}

function searching(){
    var selectedIndex = document.getElementById('searchOpt').selectedIndex;
    var destination;
    var searchStr = document.querySelectorAll('#search-bar');
    var tmpString;
    tmpString = searchStr[0];
    if(searchStr[0].value.length <= 0)
        tmpString = searchStr[1];
    tmpString = tmpString.value.replace('.','').replace(/\//g,'').replace(/\\/g,'');
    if(selectedIndex == 0)
        destination = 'anime';
    else if(selectedIndex == 1)
        destination = 'cv';
    else if(selectedIndex == 2)
        destination = 'staff';
    //console.log(selectedIndex + ',' +searchStr + ',' + document.getElementById('searchOptMobile'));
    window.location = '/search/' + destination + '/' + tmpString;
}

function searchingMobile(){
    var selectedIndex = document.getElementById('searchOptMobile').selectedIndex;
    var destination;
    var searchStr = document.querySelectorAll('#search-bar');
    var tmpString;
    tmpString = searchStr[0];
    if(searchStr[0].value.length <= 0)
        tmpString = searchStr[1];
    tmpString = tmpString.value.replace('.','').replace(/\//g,'').replace(/\\/g,'');
    if(selectedIndex == 0)
        destination = 'anime';
    else if(selectedIndex == 1)
        destination = 'cv';
    else if(selectedIndex == 2)
        destination = 'staff';
    //console.log(selectedIndex + ',' +searchStr + ',' + document.getElementById('searchOptMobile'));
    window.location = '/search/' + destination + '/' + tmpString;
}


function toString(date){
      var season;
      var month = date.getMonth();
      var year = date.getFullYear();
      if (month >= 0 && month < 3 )
          season = '冬';
      else if(month >= 3 && month < 6 )
          season = '春';
      else if(month >= 6 && month < 9 )
          season = '夏';
      else if(month >= 9)
          season = '秋';
    //console.log(date);
      return year + " " + season;
}

function toUrl(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    var season = '';
    if (month >= 0 && month < 3 )
       season = 'wi';
    else if(month >= 3 && month < 6 )
        season = 'sp';
    else if(month >= 6 && month < 9 )
      season = 'su';
    else if(month >= 9)
      season = 'au';
    // console.log(year+''+season);
     //console.log(month);
    return year + season;
    
    
}

