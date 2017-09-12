var express = require('express');
var router = express.Router();
var connection = require('./db');

router.post('/post', function(req,res){
    var statement = 'insert into comment set ?,post_date= current_timestamp';
    var newComment = {
        aid : req.body.aid,
        uid : req.body.user_id,
        uname : req.session.user_id,
        content : req.body.content,
        spoiler : (req.body.spoiler ? 1 : 0)
    };
    connection.query(statement,newComment,function(err,result){
       if(err) console.log(err); 
       res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
       res.end('');
    });
});

router.post('/list',function(req,res){
    var lengthPerExpand;// max comment fetch from a request
    var commentLimit = 5;
    
    /*
    connection.query("select count(1) as tot from comment where bam = 0 and aid = ?",[req.body.aid], function(err, rows, fields) {
       if(err) console.log(err); 
        lengthPerExpand = rows[0].tot;
    });*/
    connection.query("select count(1) as tot from comment c inner join user u on (c.uid = u.userid and u.bam = 0) where u.bam = 0 and c.bam = 0 and c.aid = ?",[req.body.aid], function(err, rows, fields) {
       if(err) console.log(err); 
        lengthPerExpand = rows[0].tot;
    });

    
    var statement = 'select u.icon, c.* from comment c inner join user u on (c.uid = u.userid and u.bam = 0) where c.bam = 0 and c.aid = ? order by post_date desc limit ? offset ?';
    //var statement = 'select user.icon,comment.* from comment,user where user.userid = comment.uid and comment.bam = 0 and comment.aid = ? order by post_date desc limit ? offset ?'; // add order by desc into statement
     connection.query(statement,[req.body.aid, commentLimit, req.body.offset],function(err,result){
       if(err) console.log(err); 
       res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
       if(result.length == 0)
        res.end('')
       else{
          if(req.body.offset+commentLimit  >= lengthPerExpand)// 
            result.push({end:true});
          else
            result.push({end:false});
       // console.log(JSON.stringify(result));
          res.end(JSON.stringify(result));
       }
    });
});

module.exports = router;