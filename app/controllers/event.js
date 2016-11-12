var db = require('../../config/db');
var request = require('request');
var Sync = require('sync');

function Todo() {

this.event = function(req, res, next) {
	db.acquire(function(err,con){

		if (err) throw err;
		var limit = 8;
		var page = req.params.page;
	    //var offset = (page - 1)  * limit;
		var offset = page;
		var jml = 0;

		var sqljum = 'SELECT COUNT(*) as jml FROM event WHERE status="1" AND tipe="public"';
		var sql ='SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_posting,tgl_mulai,tgl_berakhir,longitude,latitude FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" AND event.tipe="public" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset;
		if(req.params.tipe=='private'){
			sql ='SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_posting,tgl_mulai,tgl_berakhir,longitude,latitude FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset;
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
			console.log(jml);
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

this.eventID = function(req, res, next) {
	db.acquire(function(err,con){
		if (err) throw err;
    	con.query('SELECT id_event,admin.nama as pengirim,event.nama,event.tempat,deskripsi,foto,event.status,tgl_mulai,tgl_berakhir,tgl_posting,longitude,latitude FROM event INNER JOIN admin on admin.id_admin=event.id_admin WHERE event.status="1" AND id_event='+req.params.id+' ORDER BY tgl_posting', function(err,data){
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

}

module.exports = new Todo();
