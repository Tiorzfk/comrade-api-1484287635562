var db = require('../../config/db');
var multer  = require('multer');
const path = require('path');
const fs = require('fs');
var moment = require('moment');

function Todo() {

this.allsahabatodha = function(req,res,next) {
  db.acquire(function(err,con){
    if (err) throw err;
    con.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,about_sahabatodha,IFNULL(AVG(rating.rating),0) as rating FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user LEFT JOIN rating ON rating.id_user=sahabat_odha.id_user where user.status="1" GROUP BY sahabat_odha.id_user',function(err,data){
    //con.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,about_sahabatodha,IFNULL(AVG(rating.rating),0) as rating FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user LEFT JOIN rating ON rating.id_user=sahabat_odha.id_user where user.status="1" GROUP BY sahabat_odha.id_user',function(err,data){
      con.release();
      if(err)
				return res.json({status:400,message:err.code,result:[]});

      /*con.query('SELECT SUM(rating.rating) as rating FROM sahabat_odha INNER JOIN rating on rating.id_user=sahabat_odha.id_user GROUP BY sahabat_odha.id_user',function(err,data){
        //console.log(data);
      });
        for (var i = 0; i >= data.length; i++) {
          if(data.result[i].rating = null){
            data.result[i].rating = 0;
          }
        }*/

        return res.json({status:200,message:'success',result:data});
    });
  });
}

this.allsahabatodhauser = function(req,res,next) {
  db.acquire(function(err,con){
    if (err) throw err;
    con.query('SELECT u.id_user,u.email,u.nama,u.jk as jenis_kelamin,u.telp,u.tgl_lahir,u.foto,komunitas,about_sahabatodha,IFNULL(r.rating,0) as rating FROM sahabat_odha as so INNER join user as u on u.id_user=so.id_user LEFT JOIN rating as r ON r.id_user=so.id_user where u.status="1" AND so.id_user NOT IN (SELECT id_sahabatodha FROM friends WHERE id_user='+req.params.iduser+') GROUP BY so.id_user',function(err,data){
      con.release();
      if(err)
				return res.json({status:400,message:err.code,result:[]});


        return res.json({status:200,message:'success',result:data});
    });
  });
}

this.sahabatodha = function(req,res,next) {
	db.acquire(function(err,con){
    if (err) throw err;
    if(!isNaN(req.params.iduser)) {
		  con.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,about_sahabatodha,IFNULL(AVG(rating.rating),0) as rating FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user LEFT JOIN rating ON rating.id_user=sahabat_odha.id_user where user.status="1" AND user.id_user='+req.params.iduser+' GROUP BY sahabat_odha.id_user',function(err,data){
        con.release();
        if(err){
                return res.json({status:400,message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:400,message: 'Data not found',result:'Failed'})
            }
            return res.json({status:200,message:'success',result:data});
		  });
    }else{
      con.query('SELECT user.id_user,email,user.nama,jk as jenis_kelamin,user.telp,user.tgl_lahir,user.foto,komunitas,about_sahabatodha,IFNULL(AVG(rating.rating),0) as rating FROM user INNER JOIN sahabat_odha on sahabat_odha.id_user = user.id_user LEFT JOIN rating ON rating.id_user=sahabat_odha.id_user where user.status="1" AND user.id_user='+req.params.iduser+' GROUP BY sahabat_odha.id_user',function(err,data){
        con.release();
       if(err){
                return res.json({status:400,message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:400,message: 'Data not found',result:'Failed'})
            }
            return res.json({status:200,message:'success',result:data});
      });
    }
	});
}

this.testimoni = function(req,res,next) {
  db.acquire(function(err,con){
    if (err) throw err;
    con.query('SELECT user.nama as pengirim,testimoni,tanggal FROM rating INNER JOIN user on user.id_user=rating.id_pengerate WHERE rating.id_user='+req.params.iduser,function(err,data){
      con.release();
      if(err)
        return res.json({status:400,message:err.code,result:[]});
      if(!data.length)
        return res.json({status:400,message: 'Data not found',result:'Failed'})

      con.query('SELECT avg(rating) as rating FROM rating WHERE rating.id_user='+req.params.iduser,function(err,data2){
        return res.json({status_code:200,message:'success','rating':data2[0].rating,result:data});
      });

    });
  });
}

this.recommend = function(req,res,next) {
    var data = {
      id_sahabatodha : req.body.id_sahabatodha,
      id_user : req.body.id_user,
      pesan : req.body.pesan
    }
		db.acquire(function(err,con){
      if (err) throw err;
      con.query('INSERT INTO recommend SET ?',data,function(err,data){
        if(err)
          return res.json(err)

        return res.status(200).send({
          result: 'Success',
          status: 200,
          message: 'User berhasil di rekomendasikan menjadi Odha.'
        });

      });
		});
}

this.editsahabatodha = function(req,res,next) {
    var dataUser = {
      email : req.body.email,
      nama : req.body.nama,
      jk : req.body.jenis_kelamin,
      telp : req.body.telepon,
      tgl_lahir : req.body.tgl_lahir
    }

    var dataSahabatOdha = {
      komunitas: req.body.komunitas,
      about_sahabatodha: req.body.about_sahabatodha
    };

		db.acquire(function(err,con){
      if (err) throw err;
      con.query('UPDATE user SET ? WHERE id_user='+req.params.iduser,dataUser,function(err,data){
        if(!data.affectedRows){
          return res.json({
            status : 404,
            message: 'User not found'
          });
        }
        con.query('UPDATE sahabat_odha SET ? WHERE id_user='+req.params.iduser,dataSahabatOdha,function(err,data){
          con.release();
          return res.status(200).send({
            result: 'Success',
            status: 200,
            message: 'Profile Sahabat Odha has been Updated.'
          });
        });
      });
		});
}

this.rate = function(req,res,next){
	var data = {
		id_pengerate: req.body.id_pengerate,
    id_user: req.body.id_user,
		rating : req.body.rating,
    tanggal : moment().format('Y-MM-DD'),
		testimoni: req.body.testimoni
	}
  req.checkBody("rating", "Rating must be integer.").isInt();
    var errors = req.validationErrors();
    if (errors) {
      return res.send({
        result: 'Failed',
        status: 400,
        errors: errors
      });
    }
	db.acquire(function(err,con){
    if (err) throw err;
		con.query('INSERT INTO rating SET ? ',data,function(err,data){
      con.release();
			if (err) {
    	  return res.json({
    	  	result: 'Failed',
    	  	status: 403,
    	  	message: 'Invalid Data',
    	  	errors: err
    	  });
    	}
    		return res.status(201).send({
    	    result: 'Created',
    	    status: 201,
    			message: 'Rating has been saved.'
    		});
		});
	});
}

}

module.exports = new Todo();
