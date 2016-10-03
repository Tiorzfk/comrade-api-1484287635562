var db = require('../../config/db');

function Todo() {

this.lokasi_pemeriksaan = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT nama,alamat,foto,latitude,longitude FROM lokasi_pemeriksaan', function(err,data){
			con.release();
			if(err){
                res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            res.json({status:'200',message:'success',result:data});
		});
	});
}
this.idlokasi_pemeriksaan = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT nama,latitude,longitude FROM lokasi_pemeriksaan WHERE id_pemeriksaan='+req.params.id, function(err,data){
			con.release();
			if(err){
                res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            res.json({status:'200',message:'success',result:data});
		});
	});
}

}

module.exports = new Todo();
