var db = require('../../config/db');
var multer  = require('multer');
const path = require('path');
const fs = require('fs');

function Todo() {

this.sticker = function(req,res,next) {
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT id_sticker,user.nama as pengirim,user.foto as foto,pic_sticker,komunitas,message FROM sticker INNER JOIN user on user.id_user=sticker.id_pengirim INNER JOIN pic_sticker on pic_sticker.id_pic=sticker.id_picsticker INNER JOIN sahabat_odha on sahabat_odha.id_user=sticker.id_pengirim order by id_sticker DESC',function(err,data){
			con.release();
			if(err){
                return res.json({status:400,message:err.code,result:[]});
            }
            return res.json({status:200,message:'success',result:data});
		});
	});
}

this.sendpicsticker = function(req,res,next) {
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
        db.acquire(function(err,con){
					if (err) throw err;
            con.query('INSERT INTO pic_sticker SET ? ',data,function(err){
							con.release();
                if(err){
                    fs.unlink('public/pic_sticker/'+req.file.filename);
                    return res.json(err)
                }

                return res.status(201).send({
                    result: 'Created',
                    status_code: 201,
                    message: 'Sticker has been saved.'
                });
            });
        });
    });
}

this.sendsticker = function(req,res,next) {
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
  		    id_picsticker: req.body.id_picsticker
        }
        db.acquire(function(err,con){
					if (err) throw err;
            con.query('INSERT INTO sticker SET ? ',data,function(err){
							con.release();
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

this.pic_sticker = function(req,res,next){
    db.acquire(function(err,con){
			if (err) throw err;
        con.query("select * from pic_sticker",function(err,rows){
					con.release();
            if(err){
                return res.json({status:400,message:'Error',result:[]});
            }else{
                return res.json({status:200,message:'success',result:rows});
            }
        });
    })
}

}

module.exports = new Todo();
