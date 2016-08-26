var db = require('../../config/db').DB;

exports.banner = function(req,res,next) {
	db.getConnection(function(err,koneksi){
		res.json(err);
		koneksi.query('SELECT id_banner,nama_banner,banner_img FROM banner ORDER BY id_banner DESC LIMIT 5', function(err,data){
			if(err)
				return res.json({status:'400',message:err.code,result:[]});
			
			return res.json({status:'200',message:'success',result:data});
				
		});
		koneksi.release();
	});
};