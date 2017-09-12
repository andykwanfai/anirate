var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.IP,
  port     : 3306,
  user     : 'qqwq',
  password : '',
  database : 'anime'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... \n\n");  
  } else {
      console.log("Error connecting database ... \n\n");
      console.log(err);
  }
});

module.exports = connection;