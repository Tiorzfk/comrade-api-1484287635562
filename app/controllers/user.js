var db 	= require('../../config/db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var multer  = require('multer');
var transport = require('../../config/mail').transport;
var EmailTemplates = require('swig-email-templates');
var AES = require('./AES');
const path = require('path');
const fs = require('fs');

function randomkey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function Todo() {

this.auth_user = function(req,res,next) {
	req.checkBody("email", "Enter a valid email address.").isEmail();
	var errors = req.validationErrors();
  	if (errors) {
  	  return res.send({
  	  	result: 'Failed',
  	  	status: 400,
  	  	errors: errors
  	  });
  	} else {
  		db.acquire(function(err,con){
				if (err) throw err;
				var email = req.body.email;
			con.query('SELECT * FROM user WHERE email="'+AES.encrypt(email,'comrade@codelabs')+'"', function(err,data){
				con.release();
      	if(!data.length){
					return res.json({ status:404, message: 'Authentication failed. Email not found.',result:[] });
				}else if(data){
					//data.forEach(function(data){
            if(data[0].status == '0'){
              return res.json({message:'Maaf email yang anda masukan belum dikonfirmasi.',status:400,result:[]})
            }
            if(req.body.password){
              if(data[0].password){
                var validPassword = bcrypt.compareSync(req.body.password,data.password);
						    if(!validPassword){
						    	return res.json({ result: 'Failed', message: 'Authentication failed. Wrong password.' });
						    }
                var token = jwt.sign(data, 'comradeapp', {
                  //expiresIn: "24h" // expires in 24 hours
                });
                var data = {
                  id_user: data[0].id_user,
                  nama: data[0].nama,
                  email: data[0].email,
                  password: data[0].password,
                  jenis_kelamin: data[0].jk,
                  telepon: data[0].telp,
                  jenis_user:data[0].jenis_user,
                  private_key:data[0].private_key
                }
                return res.json({
                    message: 'Success',
                    status: 200,
                    id_user: data.id_user,
                    nama: data.nama,
                    email: data.email,
                    jenis_user:data.jenis_user,
                    foto: data.foto,
                    private_key:data.private_key,
                    token: token,
                    result: [data]
                  });
              }
              return res.json({ result: 'Failed', message: 'Authentication failed. Wrong password.' });
            }
            var token = jwt.sign(data, 'comradeapp', {
              //expiresIn: "24h" // expires in 24 hours
            });
            var data = {
              id_user: data.id_user,
              nama: data.nama,
              email: data.email,
              password: data.password,
              jenis_kelamin: data.jk,
              telepon: data.telp,
              jenis_user:data.jenis_user,
              private_key:data.private_key
            }
            return res.json({
                    message: 'Success',
                    status: 200,
                    id_user: data.id_user,
                    nama: data.nama,
                    email: data.email,
                    jenis_user:data.jenis_user,
                    foto: data.foto,
                    private_key:data.private_key,
                    token: token,
                    result: [data]
                  });
					//});
				}
			});
		});
  	}
};

this.register = function(req,res,next) {
	req.checkBody("email", "Enter a valid email address.").isEmail();
	req.checkBody("nama", "Nama cannot be blank.").notEmpty();
	req.checkBody("password", "Password cannot be blank.").notEmpty();

	var errors = req.validationErrors();
  	if (errors) {
  		return res.send({
  	  		result: 'Failed',
  	  		status: 400,
  	  		errors: errors
  	  	});
  	} else {
			var private_key = randomkey();
  		var data = {
    	    nama: AES.encrypt(req.body.nama.toString(),private_key),
    	    email: AES.encrypt(req.body.email.toString(),'comrade@codelabs'),
    	    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
    	    jenis_user: 'User',
          status  : '0',
          foto : 'default.png',
					private_key:private_key
    	}
		db.acquire(function(err,con){
			if (err) throw err;
    	    con.query("select * from user where email = '"+AES.encrypt(req.body.email,"comrade@codelabs")+"'",function(err,rows){
						con.release();
                if (err)
                    return res.json(err);

                 if (rows.length)
                    return res.json({status:'400',result:'Failed',message:'That email is already taken.'});

    	    		    con.query('INSERT INTO user SET ? ',data,function(err,result){
    	    		       //error simpan ke database
    	    		       if (err) {
    	    		           return res.json({
    	    		           	result: 'Failed',
    	    		           	status: 403,
    	    		           	message: 'Invalid Data',
    	    		           	errors: err,
								          data:data
    	    		           });
    	    		       }else{
                      var token = jwt.sign(data, 'emailconfirmationcomrade', {
                        expiresIn: "2h" // expires in 24 hours
                      });
                      var templates = new EmailTemplates({root: 'app/views/emails'});
                      var locals = {
                          email: req.body.email,
                          token: token,
                          url: 'http://comrade-api.azurewebsites.net/confirm'
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
                                          //console.log(responseStatus);
                                          return res.status(201).send({
                                            result: 'Created',
                                            status: 201,
                                            message: 'Registration is successful, check your email to activate your account.'
                                          });
                                      }
                                  }
                              );
                          }
                      });
    					      }
    	    		    });

    	    });
		});
	}
}

this.confirmation = function(req,res,next) {
  db.acquire(function(err,con){
    con.query("select * from user where email = '"+AES.encrypt(req.params.email,'comrade@codelabs')+"'",function(err,rows){
			con.release();
      if(err)
        return res.json(err);

      if(!rows.length)
        return res.json({status:400,result:'Failed',message:'email tidak ditemukan.'});
      if(rows[0].status == '1'){
        return res.render('emails/success_confirm',{
          title: 'Failed !',
          msg: 'Maaf email anda sudah dikonfirmasi.'
        });
      }
      con.query("UPDATE user SET ? WHERE email= '"+AES.encrypt(req.params.email,'comrade@codelabs')+"'",{status:'1'}, function(err,data){
        return res.render('emails/success_confirm',{
          title: 'Success !',
          msg: 'Selamat, email anda berhasil dikonfirmasi, silahkan login.'
        });
      });
    });
  });
}

this.registerbak = function(req,res,next) {
  req.checkBody("email", "Enter a valid email address.").isEmail();
  req.checkBody("nama", "Nama cannot be blank.").notEmpty();
  req.checkBody("password", "Password cannot be blank.").notEmpty();
  req.checkBody("jenis_kelamin", "Jenis Kelamin cannot be blank.").notEmpty();
  req.checkBody("tgl_lahir", "Tanggal Lahir cannot be blank.").notEmpty();
  req.checkBody("telp", "Telepon must number.").isInt();
  req.checkBody("jenis_user", "Jenis User cannot be blank.").notEmpty();
  var errors = req.validationErrors();
    if (errors) {
      return res.send({
          result: 'Failed',
          status: 400,
          errors: errors
        });
    } else {
      var data = {
          nama: req.body.nama,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
          jk: req.body.jenis_kelamin,
          tgl_lahir: req.body.tgl_lahir,
          telp: req.body.telp,
          status: "0",
          jenis_user: req.body.jenis_user
      }
    db.acquire(function(err,con){
          con.query("select * from user where email = '"+req.body.email+"'",function(err,rows){
						con.release();
                if (err)
                    return res.json(err);
                 if (rows.length) {
                    return res.json({result:'Failed',message:'That email is already taken.'});
                } else {
              con.query('INSERT INTO user SET ? ',data,function(err,result){
                  //error simpan ke database
                  if (err) {
                      return res.json({
                        result: 'Failed',
                        status: 403,
                        message: 'Invalid Data',
                        errors: err,
                        data:data
                      });
                  }
                  if(result.jenis_user = "Sahabat Odha"){
                    var sa = {
                      id_user : result.insertId,
                      nama : req.body.nama,
                      telp : req.body.telp
                    }
                    con.query('INSERT INTO sahabat_odha SET ?',sa,function(err){
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
                        message: 'Registration is successful, check your email to activate your account.'
                      });
                    });
                  }else{
                      return res.status(201).send({
                        result: 'Created',
                        status: 201,
                        message: 'Registration is successful, check your email to activate your account.'
                      });
                  }
              });
            }
        });
    });
  }
}

this.profile = function(req,res,next){
	db.acquire(function(err,con){
		con.query('SELECT id_user,nama,email,jk as jenis_kelamin, tgl_lahir,telp as telepon,foto,private_key, jenis_user FROM user WHERE status="1" AND jenis_user<>"Sahabat Odha"', function(err,data){
			con.release();
			if(err){
				return res.json(err)
			}else if(!data.length){
				return res.json({
					result: 'failed',
					message: 'Data not found'
				});
			}
			return res.json({status:'200',message:'success',result:data});
		});
	});
}

this.profileID = function(req,res,next){
	db.acquire(function(err,con){
		con.query('SELECT id_user,nama,email,jk as jenis_kelamin, tgl_lahir,telp as telepon,foto,private_key, jenis_user FROM user WHERE status="1" AND jenis_user<>"Sahabat Odha" AND id_user='+req.params.id, function(err,data){
			con.release();
			if(err){
				return res.json(err)
			}else if(!data.length){
				return res.json({
					result: 'failed',
					message: 'Data not found'
				});
			}
			return res.json({status:'200',message:'success',result:data});
		});
	});
}

this.setting_profile = function(req,res,next){
      var storage = multer.diskStorage({
          destination: function (req, file, callback) {
              callback(null, 'public/pic_user');
          },
          filename: function (req, file, callback) {
              callback(null, Date.now() + '-' + file.originalname);
          }
      });
      var upload = multer({
          // fileFilter: function (req,file,callback) {
          //   //var filetypes = /jpeg|jpg|png/;
          //   var mimetype = filetypes.test(file.mimetype);
          //   var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
          //
          //   if (mimetype && extname) {
          //     return callback(null, true);
          //   }
          //   //callback("Error: File upload only supports the following filetypes - " + filetypes);
          // },
          storage : storage}).single('foto');
        upload(req,res,function(err) {
          if(err)
            return res.json({status:400, message: err});

            /*req.checkBody("email", "Enter a valid email address.").isEmail();
            req.checkBody("telepon", "Telepon must be integer.").isInt();
            var errors = req.validationErrors();
              if (errors) {
                if(req.file){
                  fs.unlink('public/pic_user/'+req.file.filename);
                }
                return res.send({
                  status: 400,
                  message: errors
                });
              }*/
						var key = req.body.private_key;
  		      var data = [{
  		      	email : AES.encrypt(req.body.email,'comrade@codelabs'),
  		      	nama : AES.encrypt(req.body.nama,key),
              jk : req.body.jenis_kelamin,
              telp : AES.encrypt(req.body.telepon,key),
              tgl_lahir : AES.encrypt(req.body.tgl_lahir,key)
  		      }];

            if(req.file){
              data[0].foto = req.file.filename;
            }
		        db.acquire(function(err,con){
							if (err) throw err;
		        	con.query('UPDATE user SET ? WHERE id_user='+req.params.id,data, function(err,data){
								con.release();
		        		if (err) {
                  if(req.file){
                    fs.unlink('public/pic_user/'+req.file.filename);
                  }
            	    return res.json({
            	    	status: 403,
            	    	message: 'Invalid Data',
            	    	errors: err
            	    });
            	  }else if(!data.affectedRows){
                  if(req.file){
                    fs.unlink('public/pic_user/'+req.file.filename);
                  }
            	    return res.json({
										status : 404,
		        				message: 'Data not found'
		        			});
            	 }
            	 return res.json({
            	  	status: 200,
            	    message: 'Data has been changed.'
            	 });
		        });
          });
        });
}

this.change_password = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT * FROM user WHERE id_user='+req.params.id, function(err,data){
			con.release();
			if(err)
				return res.json(err)

			if(!data.length){
				return res.json({
					status: 404,
					message: 'User not found'
				});
			}

			var cek = bcrypt.compareSync(req.body.cur_password,data[0].password);
			if(!cek){
				return res.json({
					status: 400,
					message: 'Wrong current password'
				});
			}else{
				var data = {
					password : bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(8), null),
				}
				con.query('UPDATE user SET ? WHERE id_user='+req.params.id,data,function(err,data){
					return res.json({
						status: 200,
						message: 'Password has been changed'
					});
				});
			}

		});
	});
}

this.postUserPremium = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
    	var data = {
    		nama: req.body.nama,
    		email: req.body.email,
    		no_telp: req.body.telepon,
        kota: req.body.kota
    	}
		con.query("insert into user_premium set ?",[data],function(err,rows){
			con.release();
			if(err)
				return res.json({status:400,message:err,result:[]});

			return res.json({message: 'success',status:200,message:'User berhasil dibuat'});
		});
	});
};

this.userPremium = function(req,res,next){
  db.acquire(function(err,con){
		if (err) throw err;
		con.query("SELECT * FROM user_premium ORDER BY id_user DESC",function(err,data){
			con.release();
			if(err)
				return res.json({status:400,message:err,result:[]});

      if(!data.length)
        return res.json({status:404,message:'User not found',result:[]})

			return res.json({message: 'success',status:200,result:data});
		});
	});
}

}

module.exports = new Todo();
