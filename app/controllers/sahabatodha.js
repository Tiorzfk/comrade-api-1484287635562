var db = require('../../config/db').DB;
var multer  = require('multer');
const path = require('path');
const fs = require('fs');

exports.allsahabatodha = function(req,res,next) {
  db.getConnection(function(err,koneksi){
    koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,about_sahabatodha,AVG(rating.rating) as rating FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user LEFT JOIN rating ON rating.id_user=sahabat_odha.id_user where user.status="1" GROUP BY sahabat_odha.id_user',function(err,data){
      if(err)
				return res.json({status_code:400,message:err.code,result:[]});
			
      /*koneksi.query('SELECT SUM(rating.rating) as rating FROM sahabat_odha INNER JOIN rating on rating.id_user=sahabat_odha.id_user GROUP BY sahabat_odha.id_user',function(err,data){
        //console.log(data);
      });
        for (var i = 0; i >= data.length; i++) {
          if(data[i].rating === null){
            data[i].rating = 0; 
            console.log(data[0].rating);
          }
        }*/
        return res.json({status_code:200,message:'success',result:data});
    });
    koneksi.release();
  });
}

exports.sahabatodha = function(req,res,next) {
	db.getConnection(function(err,koneksi){
    if(!isNaN(req.params.iduser)) {
		  koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,about_sahabatodha,AVG(rating.rating) as rating FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user LEFT JOIN rating ON rating.id_user=sahabat_odha.id_user where user.status="1" AND user.id_user='+req.params.iduser+' GROUP BY sahabat_odha.id_user',function(err,data){
		  	if(err){
                return res.json({status_code:400,message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status_code:400,message: 'Data not found',result:'Failed'})
            }
            return res.json({status_code:200,message:'success',result:data});
		  });       koneksi.release();
    }else{
      koneksi.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,about_sahabatodha,AVG(rating.rating) as rating FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user LEFT JOIN rating ON rating.id_user=sahabat_odha.id_user where user.status="1" AND user.id_user='+req.params.iduser+' GROUP BY sahabat_odha.id_user',function(err,data){
       if(err){
                return res.json({status_code:400,message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status_code:400,message: 'Data not found',result:'Failed'})
            }
            return res.json({status_code:200,message:'success',result:data});
      });
      koneksi.release();
    }
	});
}

exports.testimoni = function(req,res,next) {
  db.getConnection(function(err,koneksi){
    koneksi.query('SELECT user.nama as pengirim,testimoni,tanggal FROM rating INNER JOIN user on user.id_user=rating.id_pengerate WHERE rating.id_user='+req.params.iduser,function(err,data){
      if(err)
        return res.json({status_code:400,message:err.code,result:[]});
      if(!data.length)
        return res.json({status_code:400,message: 'Data not found',result:'Failed'})

      return res.json({status_code:200,message:'success',result:data});
    });
    koneksi.release();
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
    tanggal : req.body.tanggal,
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