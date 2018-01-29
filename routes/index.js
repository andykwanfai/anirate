var express = require('express');
var router = express.Router();
var anime = require('./anime');
var cv = require('./cv');
var staff = require('./staff');
var profile = require('./profile');
var utility = require('./utility.js');
var connection = require('./db');

/* GET home page. */
router.get('/', function(req, res) {
    console.log('start');
    //res.sendfile( "./public/html/index.html");
    var currDate = new Date();
    console.log(currDate);
    var currentSeason = "2015au";
    var previousSeason = "2015su";
    //var currentSeason = utility.toSeasonStr(currDate);
    //var previousSeason = utility.toSeasonStr(new Date(currDate().getFullYear(), currDate().getMonth() - 3, currDate.getDate()));
    console.log('currentSeason' + currentSeason);
    // get rating top 5
    connection.query('SELECT aid, name, img_path, avg_score FROM anime.viewRank where season LIKE ? limit 5', ["%" + currentSeason + "%"], function(err, result) {
        if (err) console.log(err);
        rateTop5 = result;

        // get view top 5
        connection.query('select anime.id,anime.name,anime.img_path,count(*) as views from anime, user_follow ' +
            'where user_follow.aid = anime.id and anime.season like ? group by anime.id order by views desc limit 5', ["%" + currentSeason + "%"],
            function(err, result) {

                viewTop5 = result;
                res.render('index', { rate_top_5: rateTop5, view_top_5: viewTop5 });
            });
    });

});

// get user session
router.get('/session', function(req, res) {
    res.writeHead(200, { "Content-Type": "application/x-www-form-urlencoded" });
    res.end(JSON.stringify(req.session.user_id));
});

// get user id
router.get('/get_user_info', function(req, res) {
    connection.query('SELECT * from user where username = ?', [req.session.user_id], function(err, row, field) {
        if (err) console.log(err);
        res.writeHead(200, { "Content-Type": "application/x-www-form-urlencoded" });
        //console.log('id : ' + JSON.stringify(row));
        if (row.length > 0) {
            res.end(JSON.stringify(row[0]));
        }
        else
            res.end('');
    });
});

router.use('/anime', anime);
router.use('/cv', cv);
router.use('/staff', staff);

router.get('/test', function(req, res) {
    res.sendfile('./public/html/anime.html');
});


// auto create episode record on server start up
function insertEpisodeRecord() {
    var statement =
        'select anime.id , total_episode from anime where anime.id not in ' +
        '(select anime.id from anime,episode where anime.id = episode.aid);';
    connection.query(statement, [], function(err, result) {
        if (err) console.log("Error on select record: " + err);
        var insertRecords = [];
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].total_episode; j++) {
                    var rec = [result[i].id, j + 1, j + 1, 0, 0];
                    //
                    insertRecords[insertRecords.length] = rec;
                }
            }
            //connection.query('insert into episode (aid,episode,name,rating,unfollow) values ?',[insertRecords],function(err, result) {if(err) console.log("Error on insert record: " + insertRecords[0] + " ," + err);});
            console.log('inserted new episode records');
        }

    });
}

insertEpisodeRecord();

module.exports = router;
