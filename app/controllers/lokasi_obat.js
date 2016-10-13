var db = require('../../config/db');

function Todo() {

this.lokasi_obat = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT nama,longitude,latitude,foto,deskripsi,open_timeinfo,jenis_lokasi FROM lokasi_obat', function(err,data){
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
this.idlokasi_obat = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT nama,longitude,latitude,foto,open_timeinfo,jenis_lokasi FROM lokasi_obat WHERE id_lokasi='+req.params.id, function(err,data){
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
