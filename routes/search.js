var express = require('express');
var router = express.Router();
var utility = require("./utility.js");
var connection = require('./db');

router.get('/temp',function(req, res) {
    res.sendfile('./public/html/search.html');
});

router.get('/tag/:id',function(req,res){
    connection.query('select anime.*, sum(episode.delay_weeks)as totalDelayWeeks from anime,episode where anime.id = episode.aid and anime.id in (select aid from anime_tag where tag = ?) group by anime.id',[req.params.id],function(err,result){
       if(err) console.log(err);
       console.log(JSON.stringify(result));
       for(var i = 0 ; i < result.length ; i++){
        result[i].airedEpisode = utility.getAiredEpisode(result[i].on_air_date,result[i].total_episode,result[i].totalDelayWeeks);
       }
       res.render('search',{anime : result,search:'Tag: ' + req.params.id});
    });
});

router.get('/anime/:id',function(req, res) {
    //console.log('%' + req.params.id + '%');
    if(req.params.id.length > 0){
    //connection.query('select * from anime where name like ?',['%' + req.params.id + '%'],function(err,result){
    connection.query('select anime.*, sum(episode.delay_weeks)as totalDelayWeeks from anime,episode where anime.id = episode.aid and (anime.name like ? or anime.jname like ?) group by anime.id',['%' + req.params.id + '%', '%' + req.params.id + '%'],function(err,result){   
       if(err) console.log(err);
       console.log(JSON.stringify(result));
       for(var i = 0 ; i < result.length ; i++){
        result[i].airedEpisode = utility.getAiredEpisode(result[i].on_air_date,result[i].total_episode,result[i].totalDelayWeeks);
       }
       res.render('search',{anime : result,search:'動畫: ' + req.params.id});
    });
    }else{
        res.render('search',{anime : [],search:'搜尋錯誤'});
    }
});

router.get('/cv/:id',function(req, res) {
    connection.query('select * from cv where cvname like ?',['%' + req.params.id + '%'],function(err,result){
       if(err) console.log(err);
       res.render('search',{cv : result,search:'聲優: ' + req.params.id});
    });
});

router.get('/staff/:id',function(req, res) {
    connection.query('select * from staff where name like ?',['%' + req.params.id + '%'],function(err,result){
       if(err) console.log(err);
       res.render('search',{staff : result,search:'Staff: ' + req.params.id});
    });
});

router.get('/type/:id',function(req, res) {
    connection.query('select * from anime where id in (select aid from anime_type where type like ?)',['%' + req.params.id + '%'],function(err,result){
       if(err) console.log(err);
       for(var i = 0 ; i < result.length ; i++){
        result[i].airedEpisode = utility.getAiredEpisode(result[i].on_air_date,result[i].total_episode,0);
       }
       res.render('search',{anime : result,search:'類型: ' + req.params.id});
    });
});


router.get('/anime/',function(req, res) {
    //res.render('search',{anime : [],search:'搜尋錯誤'});
    
    //connection.query('select * from anime where name like ?',['%' + req.params.id + '%'],function(err,result){
    connection.query('select anime.*, sum(episode.delay_weeks)as totalDelayWeeks from anime,episode where anime.id = episode.aid and (anime.name like ? or anime.jname like ?) group by anime.id',['%'  + '%', '%' + '%'],function(err,result){   
       if(err) console.log(err);
       console.log(JSON.stringify(result));
       for(var i = 0 ; i < result.length ; i++){
        result[i].airedEpisode = utility.getAiredEpisode(result[i].on_air_date,result[i].total_episode,result[i].totalDelayWeeks);
       }
       res.render('search',{anime : result,search:'動畫: ' + '所有'});
    });
    
});

router.get('/cv/',function(req, res) {
    connection.query('select * from cv where cvname like ?',['%' + '%'],function(err,result){
       if(err) console.log(err);
       res.render('search',{cv : result,search:'聲優: ' + '所有'});
    });
});


router.get('/staff/',function(req, res) {
   // res.render('search',{anime : [],search:'搜尋錯誤'});
   connection.query('select * from staff where name like ?',['%' + '%'],function(err,result){
       if(err) console.log(err);
       res.render('search',{staff : result,search:'Staff: ' + '所有'});
    });
});

router.get('/type/',function(req, res) {
    //res.render('search',{anime : [],search:'搜尋錯誤'});
    connection.query('select * from anime where id in (select aid from anime_type where type like ?)',['%'  + '%'],function(err,result){
       if(err) console.log(err);
       for(var i = 0 ; i < result.length ; i++){
        result[i].airedEpisode = utility.getAiredEpisode(result[i].on_air_date,result[i].total_episode,0);
       }
       res.render('search',{anime : result,search:'類型: ' + '所有'});
    });
});

// /*
// router.get('/animeauto/:id',function(req, res) {
//     //console.log('%' + req.params.id + '%');
//     var limitNum = 5;
//     if(req.params.id.length > 0){
//     //connection.query('select * from anime where name like ?',['%' + req.params.id + '%'],function(err,result){
//     connection.query('select name from anime where name like ? limit ?',['%' + req.params.id + '%',limitNum],function(err,rows,fields){   
//       if(err) console.log(err);
//       var data = [];
//       for(var i = 0; i< (rows.length>limitNum?limitNum:rows.length) ;i++){
//           data.push(rows[i].name);
//       }
//       if(rows.length > limitNum){
//         //data.push("NeverGONNaGIVEyOUuP");
//         data.push("more ...");
//       }
//          //console.log(JSON.stringify(result));
//       res.end(JSON.stringify(data));
//     });
//     }
// });

// router.get('/cvauto/:id',function(req, res) {
//     //console.log('%' + req.params.id + '%');
//     if(req.params.id.length > 0){
//     //connection.query('select * from anime where name like ?',['%' + req.params.id + '%'],function(err,result){
//     /*
//     connection.query('select * from cv where cvname like ?',['%' + req.params.id + '%'],function(err,result){
//       if(err) console.log(err);
//       res.render('search',{cv : result,search:'聲優: ' + req.params.id});
//     });
//     */
//     connection.query('select cvname from cv where cvname like ?',['%' + req.params.id + '%'],function(err,rows,fields){   
//       if(err) console.log(err);
//       var data = [];
//       for(var i = 0; i< rows.length ;i++){
//           data.push(rows[i].cvname);
//       }
//          //console.log(JSON.stringify(result));
//       res.end(JSON.stringify(data));
//     });
//     }
// });

// router.get('/staffauto/:id',function(req, res) {
//     //console.log('%' + req.params.id + '%');
//     if(req.params.id.length > 0){
//     //connection.query('select * from anime where name like ?',['%' + req.params.id + '%'],function(err,result){
//     connection.query('select name from staff where name like ?',['%' + req.params.id + '%'],function(err,rows,fields){   
//       if(err) console.log(err);
//       var data = [];
//       for(var i = 0; i< rows.length ;i++){
//           data.push(rows[i].name);
//       }
//          //console.log(JSON.stringify(result));
//       res.end(JSON.stringify(data));
//     });
//     }
// });


module.exports = router;