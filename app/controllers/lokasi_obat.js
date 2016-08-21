var db = require('../../config/db').DB;

exports.lokasi_obat = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT nama,alamat,foto,open_timeinfo FROM lokasi_obat', function(err,data){
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
		koneksi.query('SELECT nama,alamat,foto,open_timeinfo FROM lokasi_obat WHERE id_lokasi='+req.params.id, function(err,data){
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