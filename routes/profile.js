var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var utility = require('./utility.js');
var connection = require('./db');

router.get('/', function(req, res) {
  connection.query('select * from user where username = ?',[req.session.user_id],function(err,result){
    if(err) console.log(err);
    if(result.length > 0){
      var icon = result[0].icon;
      var processedDate = result[0].reg_date.getDate()+'-'+(result[0].reg_date.getMonth() + 1)+'-'+result[0].reg_date.getFullYear();
      connection.query('select user.*,comment.content,comment.post_date,anime.name as anime_name,anime.id as aid from user,comment,anime where user.userid = comment.uid and comment.aid = anime.id and user.username = ? order by comment.id desc limit 5',[req.session.user_id],function(err, result) {
        //console.log('result' + JSON.stringify(result));
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('profile',{username:req.session.user_id,reg_date:processedDate,icon:icon,recent_post : result});
        
        
      })
    }
    else
      res.sendfile('./public/html/login.html');
      
  });
});

router.post('/alter',function(req, res) {
  
  if(req.body.newIcon.length > 0){
        connection.query('update user set icon = ? where username = ?',[req.body.newIcon,req.session.user_id],function(err, result) {
          if(err) console.log(err);
          res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
          res.end('');
        });
  }
  if(req.body.newPassword.length > 0 && req.body.newPassword2.length > 0){
      connection.query('select userid,password from user where username = ?',[req.session.user_id],function(err, result) {
      if(err) console.log(err);
      if(result.length > 0 && bcrypt.compareSync(req.body.oldPassword, result[0].password)){// user's old password is correct
        connection.query('update user set password = ? where username = ?',[bcrypt.hashSync(req.body.newPassword,10),req.session.user_id],function(err, result) {
          res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
          res.end('');
        });
      }else{
        res.writeHead(401,{"Content-Type" : "application/x-www-form-urlencoded"});
        res.end('');
      }
    });
  }


})

module.exports = router;