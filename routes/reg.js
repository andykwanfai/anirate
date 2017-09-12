var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var router = express.Router();
var connection = require('./db');

var parser = bodyParser.urlencoded({ extended: false });

// submit reg form and insert new user in db
router.post("/", function(req,res){
   var insert = {
      // username : req.body.user_id,
       username : req.body.user_id.trim(),
       //password : req.body.pw,//
       password: bcrypt.hashSync(req.body.password, 10),
       //email : req.body.email
       email : req.body.email.trim(),
       icon:'https://pbs.twimg.com/profile_images/476169263305457665/I8QlqUVh.jpeg'
   };
   var statement = "INSERT INTO user SET ?,reg_date= NOW();";
   console.log("reg record : " +  JSON.stringify(insert));
   connection.query(statement,insert,sqlErrHandler);
   res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
   res.end('');
});

// check if username is used,return query result
router.post("/checkName",parser,function(req,res){
    var name = {
        //username : getKeyValues(req)[0].user_id
        username : getKeyValues(req)[0].user_id.trim()
    };
    var statement = "SELECT * FROM user WHERE ?";
    connection.query(statement,name,function(err,row,field){
        if(err) console.log(err);
        else {
            res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
            res.end(JSON.stringify(row));
        }
    });
});

router.post('/checkEmail',function(req, res) {
    var statement = "SELECT * FROM user WHERE ?";
    console.log('email :' + JSON.stringify(req.body));
    //connection.query(statement,{email : req.body.email},function(err,row,field){
    connection.query(statement,{email : req.body.email.trim()},function(err,row,field){    
        if(err) console.log(err);
        else {
            res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
            res.end(JSON.stringify(row));
        }
    });
    
});

router.post('/checkCaptcha',function(req, res) {
    if(req.body.validcode == req.session.captchaCode){
        res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
        res.end('1');
    }else{
        res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
        res.end('0');
    }
});


var sqlErrHandler = function(err){
    if(err)
    console.log(err);
};

// use to convert request body to JSON array
function getKeyValues(req){
     var reqArray = [];
      var i = 0;
   for(var key in req.body){
     reqArray[i] = JSON.parse(key);
     i++;
   }
      return reqArray;
}


module.exports = router;