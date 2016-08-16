var mysql = require("mysql");

/*var konek = {
   host     : 'mysql8.000webhost.com',
   user     : 'a6451348_cdb123',
   password : 'bismilah123',
   port 	: 3306,
   database : 'a6451348_cdb'
 };*/

 var konek = {
   host     : 'ap-cdbr-azure-southeast-b.cloudapp.net',
   user     : 'b8bf14d452d4b5',
   password : 'b1476b57',
   port 	: 3306,
   database : 'comradedb'
 };

/*var konek = {
	host		: 'localhost',
	user		: 'root',
	password	: '',
	database	: 'comradedb'
};*/

var DB = mysql.createPool(konek);

module.exports.DB = DB;