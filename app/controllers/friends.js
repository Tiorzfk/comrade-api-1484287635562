var db = require('../../config/db');

function Todo() {

this.getfriend = function(req,res,next) {
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT friends.id_sahabatodha,email,nama,jk as jenis_kelamin,telp as telepon,tgl_lahir,foto,komunitas,about_sahabatodha FROM friends INNER JOIN user ON user.id_user=friends.id_sahabatodha INNER JOIN sahabat_odha ON sahabat_odha.id_user=friends.id_sahabatodha where friends.status="1" AND friends.id_user='+req.params.id_user, function(err,data){
			con.release();
			if(err)
				return res.json({status:400,message:err.code,result:[],id_usr:req.params.id_user});

			if(!data.length)
				return res.json({status:400,message: 'Data not found',result:[]})

			return res.json({status:200,message:'success',result:data});
		});
	});
};

this.getfriendsahabatodha = function(req,res,next) {
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT friends.id_user,email,nama,jk as jenis_kelamin,telp as telepon,tgl_lahir,foto,user.jenis_user as jenis_user FROM friends INNER JOIN user ON user.id_user=friends.id_user where friends.status="1" AND friends.id_sahabatodha='+req.params.id_user, function(err,data){
			con.release();
			if(err)
				return res.json({status:400,message:err.code,result:[],id_usr:req.params.id_user});

			if(!data.length)
				return res.json({status:400,message: 'Data not found',result:[]})

			return res.json({status:200,message:'success',result:data});
		});
	});
};

this.addfriends = function(req,res,next){
	db.acquire(function(err,con){
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
		con.query("insert into friends set ?",[data],function(err,rows){
			con.release();
			if(err)
				return res.json({result:'Failed',status:400,message:err,result:[]});

			return res.json({result: 'success',status:200,message:'Berhasil menambahkan teman'});
		});
	});
};

this.konfirmasi = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		var data = [req.body.id_sahabatodha,req.body.id_user];
		con.query('update friends set status="1" where id_sahabatodha=? AND id_user=?',data,function(err,data){
			con.release();
			if (!data.affectedRows)
				return res.json({status:400,message: 'Data not found',result:[]})

			return res.json({result:'success',status:200,message:'Konfirmasi teman berhasil'});

		});
	});
};

this.hapuskontak = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		var data = [req.body.id_sahabatodha,req.body.id_user,"1"];
		con.query('delete from friends where id_sahabatodha=? AND id_user=? AND status=?',data,function(err,data){
			con.release();
			if (!data.affectedRows)
				return res.json({status:400,message: 'Data not found',result:[]})

			return res.json({result:'success',status:200,message:'Kontak berhasil dihapus'});

		});
	});
};

}
module.exports = new Todo();
