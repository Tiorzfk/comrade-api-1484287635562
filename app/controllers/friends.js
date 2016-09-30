var db = require('../../config/db').DB;

exports.getfriend = function(req,res,next) {
	db.getConnection(function(err,koneksi){
		if (err) throw err;
		koneksi.query('SELECT friends.id_sahabatodha,email,nama,jk as jenis_kelamin,telp as telepon,tgl_lahir,foto,komunitas,about_sahabatodha FROM friends INNER JOIN user ON user.id_user=friends.id_sahabatodha INNER JOIN sahabat_odha ON sahabat_odha.id_user=friends.id_sahabatodha where friends.id_user='+req.params.id_user, function(err,data){
			if(err)
				return res.json({status:400,message:err.code,result:[],id_usr:req.params.id_user});

			if(!data.length)
				return res.json({status:400,message: 'Data not found',result:'Failed'})

			return res.json({status:200,message:'success',result:data});
		});
		koneksi.release();
	});
};

exports.getfriendsahabatodha = function(req,res,next) {
	db.getConnection(function(err,koneksi){
		if (err) throw err;
		koneksi.query('SELECT friends.id_user,email,nama,jk as jenis_kelamin,telp as telepon,tgl_lahir,foto,user.jenis_user as jenis_user FROM friends INNER JOIN user ON user.id_user=friends.id_user where friends.id_sahabatodha='+req.params.id_user, function(err,data){
			if(err)
				return res.json({status:400,message:err.code,result:[],id_usr:req.params.id_user});

			if(!data.length)
				return res.json({status:400,message: 'Data not found',result:'Failed'})

			return res.json({status:200,message:'success',result:data});
		});
		koneksi.release();
	});
};

exports.addfriends = function(req,res,next){
	db.getConnection(function(e,koneksi){
		if (err) throw err;
		req.checkBody("id_user", "Id User cannot be blank.").notEmpty();
  		req.checkBody("id_sahabatodha", "Id Sahabat Odha cannot be blank.").notEmpty();
  		var errors = req.validationErrors();
  		if (errors) {
  		    return res.send({
  		        result: 'Failed',
  		        status_code: 400,
  		        errors: errors
  		      });
    	}
    	var data = {
    		id_user: req.body.id_user,
    		id_sahabatodha: req.body.id_sahabatodha,
    		status: '0'
    	}
		koneksi.query("insert into friends set ?",[data],function(err,rows){
			if(err)
				return res.json({result:'Failed',status:400,message:err,result:[]});

			return res.json({result: 'success',status:200,message:'Berhasil menambahkan teman'});
		});
		koneksi.release();
	});
};

exports.konfirmasi = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query("select * from friends where id_friends=?",req.body.id_friends,function(err,rows){
			if (err) throw err;
			if(rows.lenght>0){
				if(status==0){
					koneksi.query("delete from friends where id_friends=?",req.body.id_friends,function(err,rows2) {
						if(!err){
							res.json({status:200,message:'Pertemanan dihapus',result:[]});
						}
					});
				}else{
					koneksi.query("update friends set status='1' where id_friends=?",req.body.id_friends,function(err,rows) {
						if(!err){
							res.json({status:200,message:'Pertemanan berhasil di konfirmasi',result:[]});
						}
					});
				}
			}
		});
		koneksi.release();
	});
};
