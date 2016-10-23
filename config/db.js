var mysql = require("mysql");
/*var konek = {
	host		: 'localhost',
	user		: 'root',
	password	: '',
	database	: 'comradedb'
};*/

/*var konek = {
   host     : 'mysql8.000webhost.com',
   user     : 'a6451348_cdb123',
   password : 'bismilah123',
   port 	: 3306,
   database : 'a6451348_cdb'
 };*/
function Connection() {

  this.pool = null;

  var konek = {
    connectionLimit: 10,
    host     : 'ap-cdbr-azure-southeast-b.cloudapp.net',
    user     : 'b065bc94f582d8',
    password : '67928ce1',
    port 	: 3306,
    database : 'acsm_960a6532c696724'
  };

  this.init = function() {
    this.pool = mysql.createPool(konek);
  }

  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}
module.exports = new Connection();
