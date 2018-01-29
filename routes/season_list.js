var express = require('express');
var router = express.Router();
var utility = require('./utility.js');
var connection = require('./db');

var statementGetCurrentSeason = 'select anime.*, user_follow.episode, user_follow.uid from anime ' +
'left join (select * from user_follow where uid=(select userid from user where username=?)) as user_follow on anime.id = user_follow.aid ' +
'where anime.season like ?'

// get current season list
router.post('/current', function(req,res){
  //var season = utility.toSeasonStr(new Date());
  //var previousSeason = utility.toSeasonStr(new Date(new Date().getFullYear(),new Date().getMonth() - 3,new Date().getDate()));
  var season = "2015au";
  var season = "2015su";
  //console.log(JSON.stringify(season));
  connection.query(statementGetCurrentSeason,[req.session.user_id,"%"+season+"%"],function(err, row,field) {
    if(err) console.log(err);
    else{
      if(row.length > 0){
        res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
        //console.log(JSON.stringify(row));
        res.end(JSON.stringify(row));
      }
    }
  });
});

// get season list
router.get('/:season',function(req,res){
  //console.log(req.params.season);
  var statement;
  var input;
  var season_name;
  if(req.params.season == 'all-season'){
    statement = 'select count(*),season from anime where season not like \'%;%\' group by season order by left(season,4) desc, FIELD(right(season,2),\'wi\',\'sp\',\'su\',\'au\') desc';
    input = [];
    connection.query(statement,input,function(err, row,field) {
      if(err) console.log(err);
      var allSeason = [];
      var seasonShortTerm = [];
      //console.log(JSON.stringify(row));
      for(var i = 0 ; i < row.length ;i++){
        allSeason[i] = {name : utility.toFullStr(row[i].season),term:row[i].season};
      }
      res.render('season_list_all',{season_all:allSeason});
    });
  }else{
    statement = 'select anime.*, IFNULL(follow.followers,0) as followers, sum(unfollow) as unfollowers, IFNULL(avg_score,0) as avg_score'+
    ' from anime left join episode on anime.id=episode.aid'+
    ' left join viewRank on anime.id=viewRank.aid'+
    ' left join (select aid, count(*) as followers from user_follow group by aid) as follow on anime.id=follow.aid'+
    ' where anime.season like ? group by anime.id';
    if(isSeasonStrCorrect(req.params.season)){
      season_name = utility.toFullStr(req.params.season);
      connection.query(statement,["%"+req.params.season+"%"],function(err, row,field) {
        
        if(err) console.log(err);
          res.render('season_list',{anime:row,season_list:req.params.season,season_name:season_name});
        
      });
    }else
        res.render('error',{error:'404 Not Found'});

  }
});

// request for extra season list
router.get('/request/:season',function(req, res) {
  
  if(isSeasonStrCorrect(req.params.season)){
    connection.query('select * from anime where season like ?',["%"+req.params.season+"%"],function(err, row,field) {
      if(err) console.log(err);
        res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
        //console.log(JSON.stringify(row));
        res.end(JSON.stringify(row));
    });
  }
  else
    res.render('error',{error:'404 Not Found'});
});

function isSeasonStrCorrect(seasonStr){
  if(seasonStr.length == 6 || seasonStr == 'all-season'){
    var year = seasonStr.substr(0,4);
    var season = seasonStr.substr(4,2);
    //console.log(year +',' + season);
    if(isNaN(parseInt(year)) || (season != 'sp' && season != 'su' && season != 'au' && season != 'wi') )
      return false;
  }else
    return false;
  return true;
}
module.exports = router;