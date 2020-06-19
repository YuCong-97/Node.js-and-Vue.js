var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'world'
});
 
connection.connect();
 
connection.query('select * from city', function (err, results, fields) {
  if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
  console.log(results);
  console.log(fields);
});
connection.end();