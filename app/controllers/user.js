var db 	= require('../../config/db').DB;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var multer  = require('multer');
var transport = require('../../config/mail').transport;
var EmailTemplates = require('swig-email-templates');
const path = require('path');
const fs = require('fs');

exports.auth_user = function(req,res,next) {
	req.checkBody("email", "Enter a valid email address.").isEmail();
	var errors = req.validationErrors();
  	if (errors) {
  	  return res.send({
  	  	result: 'Failed',
  	  	status_code: 400,
  	  	errors: errors
  	  });
  	} else {
  		db.getConnection(function(err,koneksi){
			koneksi.query('SELECT * FROM user WHERE email="'+req.body.email+'"', function(err,data){
      	if(!data.length){
					return res.json({ result: 'Failed', message: 'Authentication failed. Email not found.' });
				}else if(data){
					data.forEach(function(data){
            var validPassword = bcrypt.compareSync(req.body.password,data.password);
						if(!validPassword){
							return res.json({ result: 'Failed', message: 'Authentication failed. Wrong password.' });
						}else{
							var token = jwt.sign(data, 'comradeapp', {
    	      					//expiresIn: "24h" // expires in 24 hours
    	    				});
    	    				return res.json({
    	    				  result: 'Success',
    	    				  status_code: 200,
                    token: token,
                    id_user: data.id_user,
                    nama: data.nama,
                    email: data.email,
                    password: data.password,
                    jenis_kelamin: data.jk,
                    telepon: data.telp,
                    jenis_user:data.jenis_user,
                    foto: data.foto
    	    				});
    	    				
						}
					});
				}
			});
      koneksi.release();
		});
  	}

};

exports.register = function(req,res,next) {
	req.checkBody("email", "Enter a valid email address.").isEmail();
	req.checkBody("nama", "Nama cannot be blank.").notEmpty();
	req.checkBody("password", "Password cannot be blank.").notEmpty();
	var errors = req.validationErrors();
  	if (errors) {
  		return res.send({
  	  		result: 'Failed',
  	  		status_code: 400,
  	  		errors: errors
  	  	});
  	} else {
  		var data = {
    	    nama: req.body.nama,
    	    email: req.body.email,
    	    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
    	    jenis_user: 'User',
          status  : '0',
          foto : 'default.png'
    	}
		db.getConnection(function(err,koneksi){
    	    koneksi.query("select * from user where email = '"+req.body.email+"'",function(err,rows){
                if (err)
                    return res.json(err);

                 if (rows.length) 
                    return res.json({status:'400',result:'Failed',message:'That email is already taken.'});

    	    		    koneksi.query('INSERT INTO user SET ? ',data,function(err,result){
    	    		       //error simpan ke database
    	    		       if (err) {
    	    		           return res.json({
    	    		           	result: 'Failed',
    	    		           	status_code: 403,
    	    		           	message: 'Invalid Data',
    	    		           	errors: err,
								          data:data
    	    		           });
    	    		       }else{
                      var templates = new EmailTemplates({root: 'app/views/emails'});
                      var locals = {
                          email: req.body.email,
                          url: 'http://acme.com/confirm/xxx-yyy-zzz'
                      };

                      templates.render('confirm-email.html', locals, function(err, html) {
                          if (err) {
                            return res.json({
                              result: 'Failed',
                              status_code: 403,
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
                                            status_code: 403,
                                            errors: err,
                                          });
                                      } else {
                                          console.log(responseStatus);
                                          return res.status(201).send({ 
                                            result: 'Created',
                                            status_code: 201,
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
          koneksi.release();
		});
	}
}

exports.registerbak = function(req,res,next) {
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
          status_code: 400,
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
    db.getConnection(function(err,koneksi){
          koneksi.query("select * from user where email = '"+req.body.email+"'",function(err,rows){
                if (err)
                    return res.json(err);
                 if (rows.length) {
                    return res.json({result:'Failed',message:'That email is already taken.'});
                } else {
              koneksi.query('INSERT INTO user SET ? ',data,function(err,result){
                  //error simpan ke database
                  if (err) {
                      return res.json({
                        result: 'Failed',
                        status_code: 403,
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
                    koneksi.query('INSERT INTO sahabat_odha SET ?',sa,function(err){
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
                        message: 'Registration is successful, check your email to activate your account.' 
                      });
                    });
                    koneksi.release();
                  }else{
                      return res.status(201).send({ 
                        result: 'Created',
                        status_code: 201,
                        message: 'Registration is successful, check your email to activate your account.' 
                      });
                  }
              });
            }
        });
    });
  }
}

exports.profile = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT id_user,nama,email,password,jk as jenis_kelamin, tgl_lahir,telp as telepon, jenis_user,biodata FROM user WHERE status="1"', function(err,data){
			if(err){
				return res.json(err)
			}else if(!data.length){
				return res.json({
					result: 'Failed',
					message: 'Data not found'
				});
			}
			return res.json(data);
		});
    koneksi.release();
	});
}

exports.setting_profile = function(req,res,next){
      var storage = multer.diskStorage({
          destination: function (req, file, callback) {
              callback(null, 'public/pic_user');
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
          },storage : storage}).single('foto');
        upload(req,res,function(err) {
          if(err)
            return res.json({result:'Failed', message: err});
            
            req.checkBody("email", "Enter a valid email address.").isEmail();
            req.checkBody("telepon", "Telepon must be integer.").isInt();
            var errors = req.validationErrors();
              if (errors) {
                if(req.file){            
                  fs.unlink('public/pic_sahabatodha/'+req.file.filename);
                }
                return res.send({
                  result: 'Failed',
                  status_code: 400,
                  errors: errors
                });
              }

  		      var data = [{
  		      	email : req.body.email,
  		      	nama : req.body.nama,
              jk : req.body.jenis_kelamin,
              telp : req.body.telepon,
              tgl_lahir : req.body.tgl_lahir,
              jenis_user : req.body.jenis_user
  		      }];

            if(req.file){
              data[0].foto = req.file.filename;
            }
		        db.getConnection(function(err,koneksi){
		        	koneksi.query('UPDATE user SET ? WHERE id_user='+req.params.id,data, function(err,data){
		        		if (err) {
                  if(req.file){            
                    fs.unlink('public/pic_sahabatodha/'+req.file.filename);
                  }
            	    return res.json({
            	    	result: 'Failed',
            	    	status_code: 403,
            	    	message: 'Invalid Data',
            	    	errors: err
            	    });
            	  }else if(!data.affectedRows){
                  if(req.file){            
                    fs.unlink('public/pic_sahabatodha/'+req.file.filename);
                  }
            	    return res.json({
		        				result: 'Failed',
		        				message: 'Data not found'
		        			});
            	 }
            	 return res.status(201).send({ 
            	  	result: 'Success',
            	  	status_code: 200,
            	    message: 'Data has been changed.' 
            	 });
		        });
            koneksi.release();
          });
        });
}

exports.change_password = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT * FROM user WHERE id_user='+req.params.id, function(err,data){
			if(err){
				return res.json(err)
			}else if(!data.length){
				return res.json({
					result: 'Failed',
					message: 'Data not found'
				});
			}
			data.forEach(function(data){
				if(req.body.cur_password != data.password){
					return res.json({
						result: 'Failed',
						message: 'Wrong current password'
					});
				}else{
					var data = {
						password : req.body.new_password
					}
					koneksi.query('UPDATE user SET ? WHERE id_user='+req.params.id,data,function(err,data){
						return res.json({
							result: 'OK',
							status_code: 200,
							message: 'Password has been changed'
						});
					});
				}
			});
		});
    koneksi.release();
	});
}

exports.sahabat_odha = function(req,res,next){
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT ', function(err,data){

		});
	});
}