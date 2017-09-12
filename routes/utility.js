
var utility = {};

// calculate how many episodes have been aired
utility.getAiredEpisode = function(onAirDate,total_episode,totalDelayWeeks){
  var now = new Date();
  var onAir = onAirDate;
  var episode = 0;
  var a = (now.getTime() - onAir.getTime() - totalDelayWeeks *(1000 * 60 * 60 * 24 * 7))/(1000 * 60 * 60 * 24 * 7) + 1;
  //console.log("////////////////time : "  +a);
  if(a > 0)
    episode = a;
  if(episode > total_episode)
    episode = total_episode;
    
  return Math.floor(episode);
};

utility.toSeasonStr = function(date){
  var year = date.getFullYear();
  var month = date.getMonth();
  var season = '';
  if (month >= 0 && month < 3 )
      season = 'wi';
  else if(month >= 3 && month < 6 )
      season = 'sp';
  else if(month >= 6 && month < 9 )
      season = 'su';
  else if(month >= 9)
      season = 'au';
    //console.log(year+''+season);
  return year + season;
  
};

utility.toFullStr = function toString(date){
      var seasonstr = date.substr(4,2);
      var year = date.substr(0,4);
      var season = '';
      if (seasonstr == 'wi')
          season = '冬';
      else if(seasonstr =='sp' )
          season = '春';
      else if(seasonstr =='su' )
          season = '夏';
      else if(seasonstr =='au')
          season = '秋';
      console.log(year + " " + season);
      return year + " " + season;
};

module.exports = utility;