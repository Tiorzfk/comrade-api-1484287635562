var db = require('../../config/db').DB;

exports.getfriend = function(req,res,next) {
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT * FROM friends where id_user=?',req.params.id_user, function(err,data){
			if(!err)
				res.json({status:'200',message:'success',result:data});
			else 
				res.json({status:'400',message:err.code,result:[],id_usr:req.params.id_user});
			koneksi.release();
		});
	});
};

exports.addfriends = function(req,res,next){
	db.getConnection(function(e,koneksi){
		koneksi.query("insert into friends set id_user=? and id_sahabatodha=? and status='0'",[req.body.id_user,req.body.id_sahabatodha],function(err,rows){
			if(err){
				res.json({status:400,message:err,result:[]});
			}else{
				res.json({status:200,message:'success',result:[]});
			}

		});
	});
};

exports.konfirmasi = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query("select * from friends where id_friends=?",req.body.id_friends,function(err,rows){
			if(rows.lenght>0){
				if(status==0){
					koneksi.query("delete from friends where id_friends=?",req.body.id_friends,function(err,rows2) {
						koneksi.release();
						if(!err){
							res.json({status:200,message:'Pertemanan dihapus',result:[]});
						}
					});
				}else{
					koneksi.query("update friends set status='1' where id_friends=?",req.body.id_friends,function(err,rows) {
						koneksi.release();
						if(!err){
							res.json({status:200,message:'Pertemanan berhasil di konfirmasi',result:[]});
						}					
					});
				}
			}
		});
	});
};