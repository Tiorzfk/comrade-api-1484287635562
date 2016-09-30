var db = require('../../config/db').DB;

exports.lokasi_obat = function(req,res,next){
	db.getConnection(function(err,koneksi){
		if (err) throw err;
		koneksi.query('SELECT nama,alamat,longitude,latitude,foto,deskripsi,open_timeinfo,jenis_lokasi FROM lokasi_obat', function(err,data){
			if(err){
                res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            res.json({status:'200',message:'success',result:data});
		});
        koneksi.release();
	});
}
exports.idlokasi_obat = function(req,res,next){
	db.getConnection(function(err,koneksi){
		if (err) throw err;
		koneksi.query('SELECT nama,alamat,longitude,latitude,foto,open_timeinfo,jenis_lokasi FROM lokasi_obat WHERE id_lokasi='+req.params.id, function(err,data){
			if(err){
                res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            res.json({status:'200',message:'success',result:data});
		});
        koneksi.release();
	});
}
