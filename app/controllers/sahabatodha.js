var db = require('../../config/db').DB;
var multer  = require('multer');
const path = require('path');
const fs = require('fs');

exports.allsahabatodha = function(req,res,next) {
  db.getConnection(function(err,koneksi){
    koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,telp,tgl_lahir,foto,komunitas,rating,about_sahabatodha FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user WHERE user.jenis_user="Sahabat Odha" AND user.status="1" ',function(err,data){
      if(err){
				return res.json({status:'400',message:err.code,result:[]});
			}
				return res.json({status:'200',message:'success',result:data});
    });
    koneksi.release();
  });
}

exports.sahabatodha = function(req,res,next) {
	db.getConnection(function(err,koneksi){
    if(!isNaN(req.params.iduser)) {
		  koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,telp,tgl_lahir,foto,komunitas,rating,about_sahabatodha FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user WHERE jenis_user="Sahabat Odha" AND user.status="1" AND user.id_user='+req.params.iduser,function(err,data){
		  	if(err){
                return res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            return res.json({status:'200',message:'success',result:data});
		  });
      koneksi.release();
    }else{
      koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,telp,tgl_lahir,foto,komunitas,rating,about_sahabatodha FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user WHERE jenis_user="Sahabat Odha" AND user.status="1" AND user.jk="'+req.params.iduser+'"',function(err,data){
       if(err){
                return res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            return res.json({status:'200',message:'success',result:data});
      });
      koneksi.release();
    }
	});
}

exports.editsahabatodha = function(req,res,next) {
	var storage = multer.diskStorage({
       	destination: function (req, file, callback) {
       	    callback(null, 'public/pic_sahabatodha');
       	},
       	filename: function (req, file, callback) {
       	    callback(null, Date.now() + '-' + file.originalname);
       	}
    });
    var upload = multer({
       	fileFilter: function (req,file,callback) {
       		var filetypes = /jpeg|jpg|png/;
   			var mimetype = filetypes.test(file.mimetype);
   			var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

   			if (mimetype && extname) {
   			  return callback(null, true);
   			}
   			callback("Error: File upload only supports the following filetypes - " + filetypes);
   		},
   	storage : storage}).single('foto');
   	upload(req,res,function(err) {
   		if(err)
   			return res.json({result:'Failed', message: err});

  		var dataUser = {
  			nama: req.body.nama,
        jk: req.body.jenis_kelamin,
        telp: req.body.telepon,
        tgl_lahir: req.body.tgl_lahir,
  		}
      var dataSahabatOdha = [{
        nama: req.body.nama,
        komunitas: req.body.komunitas,
        telepon: req.body.telepon,
        about_sahabatodha: req.body.about_sahabatodha
      }];

      if(req.file){
        dataSahabatOdha[0].foto = req.file.filename;
      }

		db.getConnection(function(err,koneksi){
      koneksi.query('UPDATE user SET ? WHERE id_user='+req.params.iduser,dataUser,function(err,data){
				if(err){
          if(req.file){            
					  fs.unlink('public/pic_sahabatodha/'+req.file.filename);
          }
          return res.json(err);
				}else if(!data.affectedRows){
          if(req.file){
					  fs.unlink('public/pic_sahabatodha/'+req.file.filename);
          }
          return res.json({result: 'Failed',message: 'User not found'});
				}
        koneksi.query('SELECT * FROM sahabat_odha WHERE id_user='+req.params.iduser,function(err,data){
            if(req.file){
              fs.unlink('public/pic_sahabatodha/'+data[0].foto);
            }
            koneksi.query('UPDATE sahabat_odha SET ? WHERE id_user='+req.params.iduser,dataSahabatOdha,function(err,data){
            return res.status(200).send({ 
              result: 'Success',
              status_code: 200,
              message: 'Profile Sahabat Odha has been Updated.' 
            });
          });
        });
			});
      koneksi.release();
		});
	});
}

exports.rate = function(req,res,next){
	var data = {
		id_user: req.user.id_user,
		rating : req.body.rating,
		testimoni: req.body.testimoni
	}
	db.getConnection(function(err,koneksi){
		koneksi.query('INSERT INTO rating SET ? ',data,function(err,data){
			if (err) {
    	    	return res.json({
    	    		result: 'Failed',
    	    		status_code: 403,
    	    		message: 'Invalid Data',
    	    		errors: err
    	    	});
    		}
    		return res.status(201).send({ 
    	    result: 'Created',
    	    status_code: 201,
    			message: 'Rating has been saved.' 
    		});
		});
    koneksi.release();
	});
}