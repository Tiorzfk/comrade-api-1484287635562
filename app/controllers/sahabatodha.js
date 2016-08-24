var db = require('../../config/db').DB;
var multer  = require('multer');
const path = require('path');
const fs = require('fs');

exports.allsahabatodha = function(req,res,next) {
  db.getConnection(function(err,koneksi){
    koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,id_rating,about_sahabatodha FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user WHERE user.jenis_user="Sahabat Odha" AND user.status="1" ',function(err,data){
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
		  koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,telp,tgl_lahir,foto,komunitas,id_rating,about_sahabatodha FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user WHERE jenis_user="Sahabat Odha" AND user.status="1" AND user.id_user='+req.params.iduser,function(err,data){
		  	if(err){
                return res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            return res.json({status:'200',message:'success',result:data});
		  });
      koneksi.release();
    }else{
      koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,telp,tgl_lahir,foto,komunitas,id_rating,about_sahabatodha FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user WHERE jenis_user="Sahabat Odha" AND user.status="1" AND user.jk="'+req.params.iduser+'"',function(err,data){
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
    var dataSahabatOdha = {
      komunitas: req.body.komunitas,
      about_sahabatodha: req.body.about_sahabatodha
    };

		db.getConnection(function(err,koneksi){
      koneksi.query('UPDATE sahabat_odha SET ? WHERE id_user='+req.params.iduser,dataSahabatOdha,function(err,data){
        return res.status(200).send({ 
          result: 'Success',
          status_code: 200,
          message: 'Profile Sahabat Odha has been Updated.' 
        });
      });
      koneksi.release();
		});
}

exports.rate = function(req,res,next){
	var data = {
		id_pengerate: req.body.pengerate,
    id_user: req.body.id_user,
		rating : req.body.rating,
		testimoni: req.body.testimoni
	}
  req.checkBody("rating", "Rating must be integer.").isInt();
    var errors = req.validationErrors();
    if (errors) {
      return res.send({
        result: 'Failed',
        status_code: 400,
        errors: errors
      });
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