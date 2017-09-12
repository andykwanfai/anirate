var express = require('express');
var router = express.Router();
var connection = require('./db');

router.post('/vote',function(req,res){
  // find out if user voted on this episode before
  // if yes, update the vote
  // if no, insert new vote
  //console.log(req.body);
  
  if(req.body.userid != ''){
    connection.query("select rating from rate_episode where userid = ? and aid = ? and episode = ?",[req.body.userid,req.body.aid,req.body.episode],function(err, result) {
        //console.log(result);
        if(err) console.log(err);
        else if(result.length > 0){// user has voted
          //console.log("update vote");
          connection.query('update rate_episode set rating = ? where userid = ? and aid = ? and episode = ?',[req.body.rating.id,req.body.userid,req.body.aid,req.body.episode],function(err, result) {
              if(err) console.log(err);
              calculateEpisodeScore(req.body.aid,req.body.episode);
              calculateUnfollowNum(req.body.aid,req.body.episode);
              updateEpisodeFollowerNumber(req.body.aid,req.body.episode);
              upsertFollowRecord(req.body.userid,req.body.aid,req.body.episode,req.body.rating.id);
              updateAvgEpisodeScore(req.body.aid);
              res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
              res.end('');
          });
        }else if(result.length == 0){// user has not voted
          //console.log("nnew vote");
          connection.query('insert into rate_episode set ?',{userid : req.body.userid,rating : req.body.rating.id,aid:req.body.aid,episode:req.body.episode},function(err, result) {
              if(err) console.log(err);
              calculateEpisodeScore(req.body.aid,req.body.episode);
              calculateUnfollowNum(req.body.aid,req.body.episode);
              updateEpisodeFollowerNumber(req.body.aid,req.body.episode);
              upsertFollowRecord(req.body.userid,req.body.aid,req.body.episode,req.body.rating.id);
              res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
              updateAvgEpisodeScore(req.body.aid);
              res.end('');
          });
        }
    });
  }
});


router.post('/vote_overall',function(req, res) {
    if(req.body.userid != ''){
    connection.query("select rating from rate_anime where userid = ? and aid = ?",[req.body.userid,req.body.aid],function(err, result) {
        //console.log(result);
        if(err) console.log(err);
        else if(result.length > 0){// user has voted
          connection.query('update rate_anime set rating = ? where userid = ? and aid = ?',[req.body.rating.id,req.body.userid,req.body.aid],function(err, result) {
              if(err) console.log(err);
              calculateOverallScore(req.body.aid);
              //calculateUnfollowNum(req.body.aid,req.body.episode);
              res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
              res.end('');
          });
        }else if(result.length == 0){// user has not voted
          connection.query('insert into rate_anime set ?',{userid : req.body.userid,rating : req.body.rating.id,aid:req.body.aid},function(err, result) {
              if(err) console.log(err);
              calculateOverallScore(req.body.aid);
              //calculateUnfollowNum(req.body.aid,req.body.episode);
              res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
              res.end('');
          });
        }
    });
  }
});

router.post('/vote/tag',function(req, res) {
    connection.query('insert into vote_tag set ?',{aid:req.body.aid,tag:req.body.tag,uid:req.body.uid},function(err, result) {
        if(err) console.log(err);
        connection.query('update anime_tag set vote = vote + 1 where aid = ? and tag = ?',[req.body.aid,req.body.tag],function(err, result) {
            if(err) console.log(err);
            res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
            res.end('');
        })
    });
});

router.post('/add_tag',function(req, res) {
  //console.log('/add_tag');
  if(req.body.tag.length > 0 && req.body.tag.length < 20)
    connection.query('insert into anime_tag set aid=?,tag=?,vote=0,creater_id=(select userid from user where username=?)',[req.body.aid,req.body.tag,req.session.user_id], function(err, result) {
        if(err) console.log(err);
        res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
        res.end('');
    });
})

function updateEpisodeFollowerNumber(aid, episode){
  connection.query('update episode set follower_num=' +
    '(select count(*) from rate_episode where aid=? and episode=? and rating!=-1)' +
    'where aid=? and episode=?', [aid, episode, aid, episode], 
    function(err,result){
    if(err) console.log("cannot updateEpisodeFollowerNumber:" +err);
  });
}

function updateAvgEpisodeScore(aid){
  connection.query('update anime set avg_epi_rate=(select round(avg(rating),1) from episode where aid=?) where id=?'
  ,[aid, aid], function(err, result){
    if(err) console.log("cannot updateAvgEpisodeScore:" +err);
  });
}

function calculateEpisodeScore(aid,episode){
    //console.log('calculateEpisodeScore '  + aid + ',' + episode);
  connection.query('update episode set rating = ' +
'(select round(avg(rating),1) from rate_episode ' +
'where rate_episode.aid = episode.aid and rate_episode.episode = episode.episode and rate_episode.rating > 0' +
') '+
'where episode = ? and aid = ?',[episode,aid], function(err,result){
  if(err) console.log("cannot calculateEpisodeScore:" +err);
  calculateRanking();
});
}

function calculateUnfollowNum(aid,episode){
    //console.log('calculateUnfollow '  + aid + ',' + episode);
    connection.query('update episode set unfollow = ' +
'(select count(*) from rate_episode ' +
'where rate_episode.aid = episode.aid and rate_episode.episode = episode.episode and rate_episode.rating = -1' +
') '+
'where episode = ? and aid = ?',[episode,aid], function(err,result){
  if(err) console.log("cannot calculateUnfollow:" + err);
});
}

function calculateOverallScore(aid){
    connection.query('update anime set rating = ' +
'(select round(avg(rating),1) from rate_anime ' +
'where rate_anime.aid = anime.id and rate_anime.rating > 0) ' +
'where id = ? ',[aid],function(err, result) {
    if(err) console.log("cannot calculateOverallScore:" + err);
});

}

// create a ranking table to store the rank, and drop the existing one if exists
function calculateRanking(){
  var statement = 'create table rank as(select episode.aid, anime.name, anime.img_path, anime.season, round(avg(episode.rating) + anime.rating,1) as avg_score from episode,anime ' + 
'where episode.rating > 0 and episode.aid = anime.id group by aid ' + 
'order by avg_score desc)';
  connection.query('drop table if exists rank;',[],function(err, result) {
      if(err) console.log(err);
      connection.query(statement,[],function(err, result) {
        if(err) console.log("cannot calculateRating:" +err);
      });
  });
}

function upsertFollowRecord(uid,aid,episode,rating){
  var statement = 'select episode from user_follow where uid=? and aid=? and episode <= ?';
  connection.query(statement,[uid,aid,episode],function(err, result) {
      if(err) console.log(err);
      else if(result.length > 0){
        if(rating > -1){
          //console.log("update follow");
        connection.query('update user_follow set episode = (select max(episode) from rate_episode where userid=? and aid=?) where uid = ? and aid=?',[uid,aid,uid,aid],function(err, result) {
            if(err) console.log("cannot update follow rec:" +err);
        });
        }else{
          //console.log("unfollow");
          unfollow(uid,aid);
        }
      }else
        if(rating > -1)
        connection.query('insert into user_follow set uid=?, aid=?, episode = (select max(episode) from rate_episode where userid=? and aid=?)',[uid,aid,uid,aid],function(err, result) {
            if(err) console.log("cannot create follow rec:" +err);
        });
  });
}

function unfollow(uid,aid){
  var statement = 'delete from user_follow where uid = ? and aid=?';
  connection.query(statement,[uid,aid],function(err, result) {
      if(err) console.log("cannot unfollow:" +err);
  });
}



module.exports = router;