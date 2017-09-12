var express = require('express');
var router = express.Router();
var connection = require('./db');

//router.get('/')
router.get('/:id', function(req, res){
    connection.query('SELECT name from staff where id=?',[req.params.id] ,function(err, staff) {
        if(!err && staff.length > 0){
            connection.query('SELECT anime.name ,aid from anime_staff join anime on aid=anime.id where sid=?',[req.params.id] ,function(err, anime) {
                if(!err){
                    var renderInfo = {
                        name: staff[0].name,
                        //img_path: cv[0].cv_img,
                        anime: anime
                    }
                    console.log(renderInfo);
                    res.render('staff', renderInfo);
                }
                else console.log(err);
            });
        }else{
            res.render('error',{error:'404 Result Not Found'});
        }
    });
});

module.exports = router;
