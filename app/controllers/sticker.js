var db = require('../../config/db').DB;
var multer  = require('multer');
const path = require('path');
const fs = require('fs');

exports.sticker = function(req,res,next) {
	db.getConnection(function(err,koneksi){
		koneksi.query('SELECT * FROM sticker',function(err,data){
			if(err){
                res.json({status:'400',message:err.code,result:[]});
                koneksi.release();
            }
            res.json({status:'200',message:'success',result:data});
    	    koneksi.release();
		});
	});
}

exports.sendpicsticker = function(req,res,next) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/pic_sticker');
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
        storage : storage
    }).single('pic_sticker');
    upload(req,res,function(err) {
        if(err)
            return res.json({result:'Failed', message: err});
        var data = {
            pic_sticker: req.file.filename
        }
        db.getConnection(function(err,koneksi){
            koneksi.query('INSERT INTO pic_sticker SET ? ',data,function(err){
                if(err){
                    fs.unlink('public/pic_sticker/'+req.file.filename);
                    return res.json(err)
                    koneksi.release();
                }
            
                return res.status(201).send({ 
                    result: 'Created',
                    status_code: 201,
                    message: 'Sticker has been saved.' 
                });
                koneksi.release();
            });
        });
    });
}

exports.sendsticker = function(req,res,next) {
    req.checkBody("id_user", "ID User cannot be blank.").notEmpty();
    req.checkBody("message", "Message cannot be blank.").notEmpty();
    req.checkBody("id_picsticker", "ID PicSticker cannot be blank.").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      return res.send({
        result: 'Failed',
        status_code: 400,
        errors: errors
      });
    } else {
        var data = {
            id_pengirim: req.body.id_user,
  		    message: req.body.message,
  		    id_picsticker: req.body.id_sticker
        }
        db.getConnection(function(err,koneksi){
            koneksi.query('INSERT INTO sticker SET ? ',data,function(err){
                koneksi.release();
                if(err){
				    return res.json(err)
                }
				
                return res.status(201).send({ 
            	   result: 'Created',
            	   status_code: 201,
    	    	  message: 'Sticker has been saved.' 
                });
                
            });
        });
    }
}

exports.pic_sticker = function(req,res,next){
    db.getConnection(function(err,koneksi){
        koneksi.query("select * from pic_sticker",function(err,rows){
            koneksi.release();
            if(err){
                res.json({status:400,message:'Error',result:[]});
            }else{
                res.json({status:200,message:'success',result:rows});
            }
        });
    })
}