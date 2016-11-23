var db = require('../../config/db');
var multer  = require('multer');
const path = require('path');
const fs = require('fs');
var moment = require('moment');
var AES = require('./AES');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var EmailTemplates = require('swig-email-templates');
var transport = require('../../config/mail').transport;

function randomkey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

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
    con.query('SELECT u.id_user,u.email,u.nama,u.jk as jenis_kelamin,u.telp,u.tgl_lahir,u.foto,komunitas,about_sahabatodha,IFNULL(AVG(r.rating),0) as rating FROM sahabat_odha as so INNER join user as u on u.id_user=so.id_user LEFT JOIN rating as r ON r.id_user=so.id_user where u.status="1" AND so.id_user NOT IN (SELECT id_sahabatodha FROM friends WHERE id_user='+req.params.iduser+') GROUP BY so.id_user',function(err,data){
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
    con.query('SELECT user.nama as pengirim,user.private_key,testimoni,tanggal FROM rating INNER JOIN user on user.id_user=rating.id_pengerate WHERE rating.id_user='+req.params.iduser,function(err,data){
      con.release();
      if(err)
        return res.json({status:400,message:err.code,result:[]});
      if(!data.length)
        return res.json({status:400,message: 'Data not found',result:'Failed'})

      con.query('SELECT avg(rating) as rating FROM rating WHERE rating.id_user='+req.params.iduser,function(err,data2){
        return res.json({status:200,message:'success','rating':data2[0].rating,result:data});
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

  var storage = multer.diskStorage({
      destination: function (req, file, callback) {
          callback(null, 'public/pic_sahabatodha');
      },
      filename: function (req, file, callback) {
          callback(null, Date.now() + '-' + file.originalname);
      }
  });
  var upload = multer({
      // fileFilter: function (req,file,callback) {
      //   var filetypes = /jpeg|jpg|png/;
      //   var mimetype = filetypes.test(file.mimetype);
      //   var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      //   if (mimetype && extname) {
      //     return callback(null, true);
      //   }
      //   callback("Error: File upload only supports the following filetypes - " + filetypes);
      // },
      storage : storage}).single('foto');
      upload(req,res,function(err) {
      if(err)
        return res.json({status:400, message: err});

        var dataUser = [{
          email : AES.encrypt(req.body.email,'comrade@codelabs'),
          nama : req.body.nama,
          jk : req.body.jenis_kelamin,
          telp : req.body.telepon,
          tgl_lahir : req.body.tgl_lahir
        }];

        if(req.file){
          dataUser[0].foto = req.file.filename;
        }

        var dataSahabatOdha = {
          komunitas: req.body.komunitas,
          about_sahabatodha: req.body.about_sahabatodha
        };

        db.acquire(function(err,con){
       // if (err) throw err;
        con.query('UPDATE user SET ? WHERE id_user='+req.params.iduser,dataUser,function(err,data){
          /*if(!data.affectedRows){
            if(req.file){
              fs.unlink('public/pic_sahabatodha/'+req.file.filename);
            }
            return res.json({
              status : 404,
              message: 'User not found'
            });
          }*/
          if(err)
            return res.json({
              status:400,
              message:err.code,
              result:''
            });
          else {
            con.query('UPDATE sahabat_odha SET ? WHERE id_user='+req.params.iduser,dataSahabatOdha,function(err,data){
            return res.status(200).send({
              result: 'Success',
              status: 200,
              message: 'Profile Sahabat Odha has been Updated.'
            });
          });
          }
        });
        con.release();
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

this.daftarsa = function(req, res, next) {
    var data = {
      nama: req.body.nama,
      email: req.body.email,
      telp : req.body.telepon,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
      jenis_user: 'Sahabat Odha',
      status  : '0',
      foto : 'default.png',
      private_key:'comrade@codelabs'
    }
    db.acquire(function(err,con){
      con.query('INSERT INTO user SET ? ',data,function(err,result){
        if (err)
           return next(err);

        var data2 = {
          id_user : result.insertId
        }
        con.query('INSERT INTO sahabat_odha SET ? ',data2,function(err,result2){
          var token = jwt.sign(data, 'emailconfirmationcomrade', {
            expiresIn: "2h" // expires in 24 hours
          });
          var templates = new EmailTemplates({root: 'app/views/emails'});
          var locals = {
              email: req.body.email,
              token: token,
              url: 'http://comrade-api.azurewebsites.net/confirm',
          };

          templates.render('confirm-email.html', locals, function(err, html) {
              if (err) {
                return res.json({
                  result: 'Failed',
                  status: 403,
                  errors: err,
                });
              } else {
                  transport.sendMail({
                      from: 'Comrade app <Admin@comrade.com>',
                      to: locals.email,
                      subject: 'Confirmation Email.',
                      html: html
                      }, function(err, responseStatus) {
                          if (err) {
                              return res.json({
                                result: 'Failed',
                                status: 403,
                                errors: err,
                              });
                          } else {
                              return res.status(201).send({
                                result: 'Created',
                                status: 201,
                                message: 'Please check your email to complete your registration.'
                              });
                          }
                      }
                  );
              }
          });
        });
      });
    });
};


}

module.exports = new Todo();
