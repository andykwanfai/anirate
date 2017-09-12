var app = angular.module("main",[]);
app.controller("anime-ctrl", function($scope,$http,$location,$window){
    $scope.showDialog = 0;
    $scope.logged = false;
    $scope.selectEpisode = 0;
    $scope.selectEpisodeName = '';
    $scope.aid=getAnimeId();
    $scope.selectedOption = {id:0, name:''};
    $scope.user_id='';
    $scope.mode = 0;//vote mode. 0 : vote episode, 1:vote anime
    $scope.options = [
        {id:1, name:'1'},
        {id:2, name:'2'},
        {id:3, name:'3'},
        {id:4, name:'4'},
        {id:5, name:'5'},
        {id:6, name:'6'},
        {id:7, name:'7'},
        {id:8, name:'8'},
        {id:9, name:'9'},
        {id:10, name:'10'},
        {id:-1, name:'棄番'},
    ];
    $scope.commentEnded = false;
    $scope.addedTag = false;
    $scope.editingTag = false;
    $scope.commentContent = '';
    $scope.commentList = [];
    $scope.asSpoiler = false;
    $scope.tags = [];
    $scope.newTag = '';
    $scope.expandTag = false;
    $scope.tagEnded = true;
    $scope.toLoginPage = function(){
        redirect();
    };
    $scope.getSession = function(){
        $http.get('/get_user_info').success(function(res2) {
            $scope.user_id = res2.userid;
            if($scope.user_id)
                $scope.logged = true;
            $scope.getTags();
        });
    };
   
    $scope.vote = function(){
        //console.log('vote, logged ' + $scope.logged + ' selected : ' + JSON.stringify($scope.selectedOption) + ' username:' + $scope.user_id + ' anime:' + $scope.aid + ' episode:' + $scope.selectEpisode);
        if($scope.logged && $scope.selectedOption.id != 0 && $scope.user_id != ''  && $scope.aid != '')
        var votePath = ($scope.mode == 0 ? '/rating/vote' : '/rating/vote_overall');
        $http.post(votePath,{aid : $scope.aid,userid :$scope.user_id, episode : $scope.selectEpisode,rating:$scope.selectedOption}).success(
            function(res){
                $scope.showDialog = 0;
                refresh();
            });
        
    };
    $scope.getCommentList = function(){
        $http.post('/comment/list',{aid:$scope.aid,offset:0}).success(function(res) {
            //console.log(JSON.stringify(res));
            if(res.length > 0){
                //console.log(JSON.stringify(res));
                $scope.commentList = res.slice(0,res.length-1);
                $scope.commentEnded = res[res.length-1].end;
                
            }else{
                $scope.commentEnded = true;
            }
            for(var i = 0 ; i < $scope.commentList.length ; i++)
                $scope.commentList[i].seq = i;
        });
    };
    $scope.showMore = function(){
        $http.post('/comment/list',{aid:$scope.aid,offset:$scope.commentList.length}).success(function(res) {
            if(res.length > 0){
                $scope.commentEnded = res[res.length-1].end;
                res = res.slice(0,res.length-1);
                $scope.commentList = $scope.commentList.concat(res);
                //console.log(JSON.stringify($scope.commentList));
            }
        });
    }
    $scope.showSpoiler = function(id){
        
        $scope.commentList[id].spoiler = 0;
    }
    
    $scope.postComment = function(){
        var newComment = {
            aid : $scope.aid,
            user_id : $scope.user_id,
            content : $scope.commentContent,
            spoiler : $scope.asSpoiler
        };
        $http.post('/comment/post',newComment).success(function(res) {
            $scope.showDialog = 0;
            $scope.commentContent = '';
            refresh();
        });
        
    };
    $scope.convertDataString = function(datestring){
        if(datestring != null) return datestring.replace('T',' ').slice(0,19);
    };
    $scope.getTags = function(){
        $http.post('/anime/tag',{aid:$scope.aid,getAllTag:$scope.expandTag}).success(
            function(res) {
                $scope.tags = res;
                if(!$scope.expandTag && $scope.tags.length > 5){
                    $scope.tagEnded = false;
                    $scope.tags = $scope.tags.slice(0,5);
                }
                for(var i = 0 ; i < $scope.tags.length ; i++){
                    $scope.tags[i]['id'] = i;
                    if($scope.tags[i].creater_id == $scope.user_id){
                        $scope.addedTag = true;
                    }
                }
                
            }
            
        );
    }
    
    $scope.voteTag = function(id){
        //console.log($scope.tags[id]);
        $http.post('/rating/vote/tag',{aid:$scope.tags[id].aid,tag:$scope.tags[id].tag,uid:$scope.user_id}).success(
            function(res){$scope.getTags($scope.expandTag);}
        );
    };
    $('.addTagTooltip').tooltipster({
        trigger: 'click'
    });
    $scope.insertNewTag = function(){
        if($scope.newTag.length == 0){
            $('.addTagTooltip').tooltipster('content', 'tag不能為空白')
            
        }else if($scope.newTag.length > 20){
            $('.addTagTooltip').tooltipster('content', '字數不能超過20');
        }else
            $http.post('/rating/add_tag',{aid : $scope.aid,tag:$scope.newTag}).success(function(res){
                $scope.getTags();
                $scope.addedTag = true;
            });
    }
    $scope.getNewTagButtonText = function(){
        if(!$scope.editingTag) return '新Tag';else return 'Add Tag';
    }
    $scope.onClickNewTagButton = function(){
        if(!$scope.editingTag)$scope.editingTag = true; else $scope.insertNewTag();
    }
    $scope.getSession();
    
    $scope.getCommentList();
    
});

function refresh(){
    location.reload();
}

function redirect(){
    window.location = "/login/"
}

function getAnimeId(){
    return window.location.href.split('/')[4];
}

function onEnterThumb(img){
    img.src='../img/thumb_blue.png';
}
function onLeaveThumb(img){
    img.src='../img/thumb.png';
}
