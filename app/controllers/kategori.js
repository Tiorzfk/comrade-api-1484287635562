var db = require('../../config/db').DB;

exports.kategori = function(req,res,next) {
	db.getConnection(function(err,koneksi){
		if (err) throw err;
		koneksi.query('SELECT * FROM kategori',function(err,kategori){
			koneksi.query('SELECT * FROM posting WHERE id_kategori=2',function(err,artikel){
				koneksi.query('SELECT * FROM posting WHERE id_kategori=1',function(err,berita){
					kategori[0].jml_post=berita.length;
					kategori[1].jml_post=artikel.length;
					if(err)
						res.json({status:'400',message:err.code,result:[]});
					else
						res.json({status:'200',message:'success',result:kategori});
					koneksi.release();
				});
			});
		});
	});
}
