var express = require('express');
var router = express.Router();
var connection = require('./db');

//router.get('/')
router.get('/:id', function(req, res){
    connection.query('SELECT cvname ,cv_img from cv where cvid=?',[req.params.id] ,function(err, cv) {
        if(!err && cv.length > 0){
            connection.query('SELECT name ,aid from anime_cv join anime on anime_cv.aid=anime.id where cvid=?',[req.params.id] ,function(err, anime) {
                if(!err){
                    var renderInfo = {
                        name: cv[0].cvname,
                        img_path: cv[0].cv_img,
                        anime: anime
                    }
                    console.log(renderInfo);
                    res.render('cv', renderInfo);
                }
                else console.log(err);
            });
        }else{
            res.render('error',{error:'404 Result Not Found'});
        }
    });
});

module.exports = router;
