var express = require('express');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');
var captchapng = require('captchapng');
var connection = require('./db');

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session({
  //store: new RedisStore({host: 'localhost', port: 3000}),
  secret: 'lifeIsSuck',
  cookie: { maxAge: 60000 }
}));
//router.use(passport.session());
//router.use(flash());



/*
var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' },
    { id: 3, username: 'tommy', password: '123', email: 'joe@example.com' }
];
*/

/*
function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}
*/

function findByUsername(username,pw, fn) {
  /*
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username && user.password === pw) {
      return fn(null, user);
    }
  }
  return fn(null, null);
  */
  /*
  var queryData= {
    username : username,
    password : pw
  }
  var logginSuccess = false;
  */
  //salt pw start
  /* var statement = "SELECT * FROM user where username = ?";
  connection.query(statement,[username],function(err,row,field){
    if(err) console.log(err);
    else{
      console.log(JSON.stringify(row));
      if(bcrypt.compareSync(pw, row[0].password)){
        //logginSuccess = true;
        fn(null,row[0]);
      }else{
        fn(null,null);
      }
    }
  });*///salt pw end
  //console.log(statement);
  //console.log('name : ' + username+ "pw :" + pw);
  var statement = "SELECT * FROM user where username = ?" ;
  
  connection.query(statement,[username.trim()],function(err,row,field){
  //connection.query(statement,[username],function(err,row,field){
    if(err) console.log(err);
    else{
      console.log(JSON.stringify(row));
      if(row.length > 0 && bcrypt.compareSync(pw, row[0].password)){
        //logginSuccess = true;
        fn(null,row[0]);
      }else{
        fn(null,null);
      }
    }
  });
}

/*
passport.serializeUser(function(user, done) {
  console.log("serial");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        //console.log(user);
        return done(null, user);
      })
    });
  }
));
*/

router.get('/',function(req, res){
  if(req.session.user_id)
     //res.sendfile("./public/html/index.html");
     res.redirect("/");
  else
    res.sendfile("./public/html/login.html");
});

/*
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/ac');
  });
  */
  
router.post('/login', function(req, res, next) {
  //console.log("login info:" + JSON.stringify(req.body));
  var username = req.body.user_id;
  var pw = req.body.pw;
  findByUsername(username,pw,function(err,user){
    if(err) console.log(err);
    else{
      if(user){
        if(user.bam == 0){
        console.log("logged in " + username);
          req.session.user_id = username;
          res.writeHead(200,{"Content-Type" : "application/x-www-form-urlencoded"});
          res.end('');
        }else{
          res.writeHead(401,{"Content-Type" : "application/x-www-form-urlencoded"});
          res.end('bam');
        }
      }else{
        console.log("no such user " + username);
        res.writeHead(401,{"Content-Type" : "application/x-www-form-urlencoded"});
        res.end('');
      }
    }
  });
  
  /*
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (user) { return res.redirect('/index'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/index');
    });
  })(req, res, next);
  */
  
});

var validcode = 0;

router.get('/reg-page', function(req, res) {
   var captcha = new Buffer(captchaImg()).toString('base64');   
   req.session.captchaCode = validcode;
   res.render('reg', {captcha : captcha});
});

router.get('/logout', function(req, res){
  delete req.session.user_id;
  res.redirect('/');
});

//regen captcha
router.get('/captcha',function(req,res){
   var captcha = new Buffer(captchaImg()).toString('base64');   
   req.session.captchaCode = validcode;
   res.writeHead(200,{"Content-Type" : "image/jpeg"});
   res.end(captcha);
});

var captchaImg = function(){
        validcode = parseInt(Math.random()*9000+1000);
        var p = new captchapng(80,30,validcode); // width,height,numeric captcha
        p.color(115, 95, 197, 100);  // First color: background (red, green, blue, alpha)
        p.color(30, 104, 21, 255); // Second color: paint (red, green, blue, alpha)
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        return imgbase64;
} 

module.exports = router;