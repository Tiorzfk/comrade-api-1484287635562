var db = require('../../config/db').DB;

exports.lokasi_pemeriksaan = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT nama,alamat,foto,latitude,longitude FROM lokasi_pemeriksaan', function(err,data){
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
exports.idlokasi_pemeriksaan = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT nama,latitude,longitude FROM lokasi_pemeriksaan WHERE id_pemeriksaan='+req.params.id, function(err,data){
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