var express = require('express');
var router = express.Router();
var utility = require('./utility.js');
var querystring = require('querystring');
var connection = require('./db');

var statementGetTag = 'select anime_tag.aid,anime_tag.tag,anime_tag.vote,anime_tag.bam,user_vote_tag.uid,anime_tag.creater_id from anime_tag ' +
'left join (select * from vote_tag where uid  = (select userid from user where username = ?)) as user_vote_tag ' +
'on anime_tag.aid = user_vote_tag.aid and anime_tag.tag = user_vote_tag.tag ' +
'where anime_tag.aid = ? and anime_tag.bam = 0 order by anime_tag.vote desc ';


router.get('/:id', function(req, res) {
  // get anime data
  connection.query('SELECT name,jname, description,img_path,total_episode,on_air_date,rating from anime where id=?',[req.params.id] ,function(err, result) {
    var anime,cv, staff;
    var episodes = [];
    if (err || result.length == 0)
      res.render('error',{error: "404 Not Found"});
    else{
      anime=result[0];
      // get cv data
      connection.query('SELECT cv.cvid, cvname, role from cv join anime_cv on cv.cvid=anime_cv.cvid where anime_cv.aid=? order by seq',[req.params.id] ,function(err, result) {
        if (!err)
          if(result.length > 0)
            cv=result;
          else{
            cv = [];
            console.log(err);
          }
          //get staff data
          connection.query('SELECT id, name, role from staff join anime_staff on staff.id=anime_staff.sid where anime_staff.aid=? order by seq',[req.params.id] ,function(err, result) {
          if(!err)
            staff=result;
          else
            console.log(err);
          // get episode rating
          connection.query('select * from episode where aid = ? order by episode asc',[req.params.id],function(err, result) {
            if(err) console.log(err);
            var totalDelayWeeks = 0;
            for(var i = 0 ;i < result.length ; i++){
              episodes[i] = {episode : result[i].episode,
                              name : result[i].name,
                              rating : result[i].rating,
                              follower_num: result[i].follower_num,
                              unfollower_num: result[i].unfollow,
                              delay_weeks : result[i].delay_weeks,
                              rated : false};
              totalDelayWeeks += result[i].delay_weeks;
            }
            var airedEpisode = utility.getAiredEpisode(anime.on_air_date,anime.total_episode,totalDelayWeeks);
            // find out which episode user has voted already
            connection.query('select episode from rate_episode where userid=(select userid from user where username = ?) and aid=? and episode > 0',[req.session.user_id,req.params.id],function(err, result) {
                if(err) console.log(err);
                for(var i = 0 ; i < result.length ; i++)
                  episodes[result[i].episode-1].rated = true;
                  connection.query('select type from anime_type where aid = ?',[req.params.id],function(err, result) {
                    var anime_types = result;
                    connection.query('select rating from rate_anime where userid = (select userid from user where username = ?) and aid = ?',[req.session.user_id,req.params.id],function(err, result){
                        if(err) console.log("Error on getting overall user rating : " + err);
                        // render the page
                        var renderInfo = {
                          title: anime.name,
                          jname : anime.jname,
                          description: anime.description,
                          staff: staff,
                          cv: cv,
                          img_path : anime.img_path,
                          total_episode : anime.total_episode,
                          episodes : episodes.slice(0,airedEpisode),
                          overall_rating:anime.rating,
                          overall_rating_rated :  result.length > 0,
                          types : anime_types
                        };
                        console.log(JSON.stringify(renderInfo));
                        res.render('anime_new', renderInfo);
                    });
                  });

              });// end of find out which episode user has voted already
          });// end of get episode rating
        });// end of get staff data
      });// end of get cv data
    }
  });// end fo get anime data
});

// get anime tag data
router.post('/tag',function(req,res){
  connection.query((statementGetTag + (req.body.getAllTag ? '' : 'limit 6')),[req.session.user_id,req.body.aid],function(err, result) {
      if(err) console.log(err);
      res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
      res.end(JSON.stringify(result));
  });
});

//select anime_type.type,anime.id,anime.name from anime_type,anime where anime.id = anime_type.aid and anime_type.type = '搞笑'


//connection.end();
module.exports = router;
