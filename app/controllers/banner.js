var db = require('../../config/db').DB;

exports.banner = function(req,res,next) {
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT * FROM banner ORDER BY id_banner DESC LIMIT 5', function(err,data){
			if(!err)
				res.json({status:'200',message:'success',result:data});
			else 
				res.json({status:'400',message:err.code,result:[]});
		});
		koneksi.release();
	});
};