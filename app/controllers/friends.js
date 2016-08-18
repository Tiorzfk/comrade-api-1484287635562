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
	req.checkBody("id_sahabatodha", "ID sahabat odha tidak boleh kosong").notEmpty();
	req.checkBody("id_user", "ID user tidak boleh kosong").notEmpty();
	var errors = req.validationErrors();
  	if (errors) {
  	  return res.send({
  	  	result: 'Failed',
  	  	status_code: 400,
  	  	errors: errors
  	  });
  	}  
	db.getConnection(function(err,koneksi){
		var data={
			id_sahabatodha:req.body.id_sahabatodha,
			id_user : req.body.id_user
		}
		koneksi.query('insert into friends set ?',data,function(err,rows) {
			koneksi.release();
			if(err)
				res.json({status:200,message:'Permintaan pertemanan dikirim',result:[]});
			else
				res.json({status:400,message:'Failed',result:[]});
		});
	});
};

exports.konfirmasi = function(req,res,next){
	
}