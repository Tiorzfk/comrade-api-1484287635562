var db = require('../../config/db');
var request = require('request');
var Sync = require('sync');
var moment = require('moment');
const fs = require('fs');
var geocoderProvider = 'google';
var httpAdapter = 'https';
var multer  = require('multer');

var extra = {
    apiKey: 'AIzaSyDjE5MTfUt5RYaEdA_I_PVvaQJlkro5e80',
    formatter: null
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra); //menghasilkan address dari lat dan long

function Todo() {

this.eventLang = function(req, res, next) {
	db.acquire(function(err,con){

		if (err) throw err;
		var limit = 8;
		var page = req.params.page;
	    //var offset = (page - 1)  * limit;
		var offset = page;
		var jml = 0;

		var sqljum = 'SELECT COUNT(*) as jml FROM event WHERE status="1" AND tipe="public"';
		var sql ='SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_posting,tgl_mulai,tgl_berakhir,longitude,latitude,kontak_person FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" AND event.tipe="public" AND event.lang="'+req.params.lang+'" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset;
		if(req.params.tipe=='private'){
			sql ='SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_posting,tgl_mulai,tgl_berakhir,longitude,latitude,kontak_person FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" AND event.lang="'+req.params.lang+'" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset;
			sqljum = 'SELECT COUNT(*) as jml FROM event WHERE status="1"';
		}
		function jml_posting(callback) {
				con.query(sqljum,function(err,data){
					con.release();
					if(err)
						return res.json({status:400,message:err.code,result:[]})

						jml = data[0].jml;
						callback(null,jml);
				});
		}
		var arr = {};
		Sync(function(){
			jml_posting.sync();
    	con.query(sql, function(err,data){
					var total_page = Math.ceil(jml / limit);
					if(err)
               	return res.json({status:400,message:err.code,result:[]});
            else if(!data.length)
                return res.json({status:400,message: 'Data not found',result:[]})
						else{
				/*
				arr = data;
				for(var i=0;i<data.length;i++){
					console.log(data[i].nama);
					request('https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyD5AorKtlRS4SGA_JrbflJoidb5wTuWZkY',function(err,response,body){
					if(!err && response.statusCode==200){
		   				var obj=JSON.parse(body);
						arr[2].tempat='tes';
						//arr[i].tempat = obj.results[0].formatted_address;
					}
					});
				}
				*/
							return res.json({status:200,total_page:total_page,message:'success',result:data});
						}
    		});
			});
		});
};

this.event = function(req, res, next) {
	db.acquire(function(err,con){

		if (err) throw err;
		var limit = 8;
		var page = req.params.page;
	    //var offset = (page - 1)  * limit;
		var offset = page;
		var jml = 0;

		var sqljum = 'SELECT COUNT(*) as jml FROM event WHERE status="1" AND tipe="public"';
		var sql ='SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_posting,tgl_mulai,tgl_berakhir,longitude,latitude,kontak_person FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" AND event.tipe="public" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset;
		if(req.params.tipe=='private'){
			sql ='SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_posting,tgl_mulai,tgl_berakhir,longitude,latitude,kontak_person FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset;
			sqljum = 'SELECT COUNT(*) as jml FROM event WHERE status="1"';
		}
		function jml_posting(callback) {
				con.query(sqljum,function(err,data){
					con.release();
					if(err)
						return res.json({status:400,message:err.code,result:[]})

						jml = data[0].jml;
						callback(null,jml);
				});
		}
		var arr = {};
		Sync(function(){
			jml_posting.sync();
    	con.query(sql, function(err,data){
					var total_page = Math.ceil(jml / limit);
					if(err)
               	return res.json({status:400,message:err.code,result:[]});
            else if(!data.length)
                return res.json({status:404,message: 'No Event',result:[]})
						else{
				/*
				arr = data;
				for(var i=0;i<data.length;i++){
					console.log(data[i].nama);
					request('https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyD5AorKtlRS4SGA_JrbflJoidb5wTuWZkY',function(err,response,body){
					if(!err && response.statusCode==200){
		   				var obj=JSON.parse(body);
						arr[2].tempat='tes';
						//arr[i].tempat = obj.results[0].formatted_address;
					}
					});
				}
				*/
							return res.json({status:200,total_page:total_page,message:'success',result:data});
						}
    		});
			});
		});
};

this.eventAll = function(req, res, next) {
	db.acquire(function(err,con){

		if (err) throw err;

		var sql ='SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_posting,tgl_mulai,tgl_berakhir,longitude,latitude,kontak_person FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" AND event.tipe="public" ORDER BY tgl_posting';
		
		var arr = {};
    	con.query(sql, function(err,data){
			con.release();
				if(err)
            	   	return res.json({status:400,message:err.code,result:[]});
            	else if(!data.length)
                	return res.json({status:400,message: 'Data not found',result:[]})
				else{
					return res.json({status:200,message:'success',result:data});
				}
    		});
		});
};

this.eventID = function(req, res, next) {
	db.acquire(function(err,con){
		if (err) throw err;
    	con.query('SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_mulai,tgl_berakhir,tgl_posting,longitude,latitude,kontak_person FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" AND id_event='+req.params.id+' ORDER BY tgl_posting', function(err,data){
					con.release();
					if(err){
                return res.json({status:400,message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:400,message: 'Data not found',result:[]})
            }
            return res.json({status:200,message:'success',result:data});
    	});
    });
};
// var tgl_mulaia = moment('19/02/1997', 'DD/MM/YYYY').format('DD MMMM YYYY');
// console.log('sebelum convert : '+tgl_mulaia);
// var tgl_mulai = moment('19 Februari 1997', 'DD MMMM YYYY').format('DD/MM/YYYY');
// console.log('sesudah convert : '+tgl_mulai);
// var a = '12 Maret 2017 12';
// console.log(a.substring(a.length - 2));
this.postEvent = function(req, res, next) {
     var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/pic_event');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
    var upload = multer({ storage : storage }).single('foto');
    upload(req,res,function(errupload) {
		if(errupload) {
			return res.json({status:400,message:errupload});
        }
        var message = null;

        var now = moment().format('DD MMMM YYYY');
        var tgl_mulai = moment(req.body.tgl_mulai, 'DD/MM/YYYY').format('DD MMMM YYYY');
        var tgl_berakhir = moment(req.body.tgl_berakhir, 'DD/MM/YYYY').format('DD MMMM YYYY');
        geocoder.geocode(req.body.posisi, function(err, result) {
            var data = {
                id_admin: req.body.id_admin,
                nama: req.body.nama,
                tempat: req.body.tempat,
                deskripsi: req.body.isi,
                status: "0",
                //foto: req.file.filename,
                tgl_posting: now,
                tgl_mulai: tgl_mulai+' '+req.body.waktu_mulai,
                tgl_berakhir: tgl_berakhir+' '+req.body.waktu_berakhir,
                latitude: result[0].latitude,
                tipe: req.body.tipe,
                longitude: result[0].longitude,
                kontak_person: req.body.kontak_person
            }
			if(req.file) {
				data.foto = req.file.filename
			}else{
				data.foto = 'default.png'
			}
            db.acquire(function(err,con){
            con.query('INSERT INTO event SET ? ',data,function(err){
              con.release();
                //error simpan ke database
                if (err) {
                    fs.unlink('public/pic_event'+data.foto);
                    return res.json({status:400,message:err});
                    //req.flash('error', err.errors);
                    //return res.redirect('/admin-komunitas/event/new');
                }
                return res.json({status:200,message:'success insert data'});
            });
            });
        });
    });
};

this.putEvent = function(req, res, next) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/pic_event');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });
    var upload = multer({ storage : storage }).single('foto');
    upload(req,res,function(errupload) {
        //error upload foto
        if(errupload) {
			return res.json({status:400,message:errupload});
        }
        var tgl_mulai = moment(req.body.tgl_mulai, 'DD/MM/YYYY').format('DD MMMM YYYY');
        var tgl_berakhir = moment(req.body.tgl_berakhir, 'DD/MM/YYYY').format('DD MMMM YYYY');
        geocoder.geocode(req.body.posisi, function(err, result) {

            var data = {
                nama: req.body.nama,
                tempat: req.body.tempat,
                deskripsi: req.body.isi,
                foto: req.body.img_old,
                tgl_mulai: tgl_mulai+' '+req.body.waktu_mulai,
                tgl_berakhir: tgl_berakhir+' '+req.body.waktu_berakhir,
                latitude: result[0].latitude,
                longitude: result[0].longitude,
                kontak_person: req.body.kontak_person
            };
            if(req.file) {
                data.foto = req.file.filename;
            };
            db.acquire(function(err,con){
            con.query('UPDATE event SET ? WHERE id_event='+req.params.id,data,function(err){
              con.release();
                if (err) {
                    if(req.file){
                        fs.unlink('public/pic_event/'+req.file.filename);
                    }
					return res.json({status:400,message:err});
                }
                else {
                    if(req.file != null){
                        fs.unlink('public/pic_event/'+req.body.img_old,function(err){
                            if(err)
                                return res.json({status:200,message:'Success update data'});
                        });
						return res.json({status:200,message:'Success update data'});
                    }else{
						return res.json({status:200,message:'Success update data'});
					}
                }
            });
            });
        });
    });
};

this.delete = function(req, res, next) {
    db.acquire(function(err,con){
            var id_event = req.params.id;
            con.query('SELECT * FROM event WHERE id_event='+id_event,function(errselect,data){
              con.release();
                con.query('DELETE FROM event WHERE id_event=?',id_event,function(err){
                    if(err){
                        return res.json({status:200,message:err});
                    }else{
                        if(data[0].foto){
                            fs.unlink('public/pic_event/'+data[0].foto,function(err){
                            	if(err)
                                	return res.json({status:200,message:'Success delete data'});
                       		});
						return res.json({status:200,message:'Success delete data'});
                        }else{
							return res.json({status:200,message:'Success delete data'});
						}
                    }
                });
            });
    });
};

}

module.exports = new Todo();
