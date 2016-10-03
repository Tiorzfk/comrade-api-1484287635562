var db = require('../../config/db');

function Todo() {

this.kategori = function(req,res,next) {
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT * FROM kategori',function(err,kategori){
			con.release();
			con.query('SELECT * FROM posting WHERE id_kategori=2',function(err,artikel){
				con.query('SELECT * FROM posting WHERE id_kategori=1',function(err,berita){
					kategori[0].jml_post=berita.length;
					kategori[1].jml_post=artikel.length;
					if(err)
						res.json({status:'400',message:err.code,result:[]});
					else
						res.json({status:'200',message:'success',result:kategori});
				});
			});
		});
	});
}

}

module.exports = new Todo();
