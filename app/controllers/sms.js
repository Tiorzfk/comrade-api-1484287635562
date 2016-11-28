var request = require('request'); 
var db = require('../../config/db');
var Sync = require('Sync');
var AES = require('./AES');

//Settingan SMS untuk percobaan 
// var userkey = "jac1ko"; 
// var passkey = "testing";
// var apiurl = "https://reguler.zenziva.net/apps/smsapi.php"; 


//Setting SMS Masking Comrade 
var userkey = "3rj4xe"; 
var passkey = "code@labs";
var apiurl = "https://alpha.zenziva.net/apps/smsapi.php"; 

function Todo() {
	this.testing = function(req,res){
		var text = req.body.text; 
		var panjang=text.length; 
		if(panjang>160)
		{
			return res.send("Maksimal kirim sms adalah 160 karakter");
		}else 
			return res.send("panjang karakter adalah"+panjang);
	}

	this.kirimsms =function(req,res) {
		var nomor = req.body.nomor;
		var pesan = req.body.pesan;
		var url = apiurl+"?userkey="+userkey+"&passkey="+passkey+"&nohp="+nomor+"&pesan="+pesan;
		var panjang = pesan.length; 
		if(pesan>160){
			return res.json({status:400,message:'Maksimal pesan yang dikirim adalah 160',result:[]});
		}else {
			request(url,function(err,response,body){
				if(!err && response.statusCode==200){
					return res.json({status:200,message:'Berhasil mengirim pesan',result:[]});
				} else {
					return res.json({status:400,message:'Terjadi kesalahan',result:err});
				}
			});
			
		}
	}

	this.kirimgroup = function(req,res){
	var pesan = req.body.pesan; 
	var nomor=new Array();
	function mulaikirim(data){
		data.forEach(function(item){
			var nomor = item.no_telp;
			var pesan = req.body.pesan;
			var url = apiurl+"?userkey="+userkey+"&passkey="+passkey+"&nohp="+nomor+"&pesan="+pesan;
        	request(url,function(err,response,body){
        		if(err)
        			console.log(err);
        	});
        });

	}

	function decryptnomor(data,callback){
		data.forEach(function(item){
			if(item.private_key!='') {
				var telp = AES.decrypt(item.telp,item.private_key)
				nomor.push({no_telp:telp});
			} else 
			{
				nomor.push({no_telp:item.telp});
			}
		});
		callback(null,nomor);
	}	

	Sync(function(){
		if(pesan.length>160)
		{
			return res.json({status:400,message:'Maksimal pesan yang dikirim adalah 160 karakter, karakter pesan anda : '+pesan.length,result:[]});
		} else {

			db.acquire(function(err,con){
				if (err) throw err;

				var kategori = req.params.kategori; 
				if(kategori=="premium")
				{
					con.query("SELECT * FROM user_premium ORDER BY id_user DESC",function(err,data){
						con.release();
						if(err)
							return res.json({status:400,message:err,result:[]});
			      		else if(!data.length)
			        		return res.json({status:404,message:'User not found',result:[]})
			        	else {
			        		mulaikirim(data);
							return res.json({status:200,message: 'Berhasil mengirim pesan',result:[]});
			        	}
					});
				}else if(kategori=="member"){
					con.query("SELECT telp,private_key FROM USER WHERE STATUS=1 AND telp!=''",function(err,data){
						con.release(); 
						decryptnomor.sync(null,data);
						mulaikirim(nomor);
						return res.json({status:200,message: 'Berhasil mengirim pesan ke '+nomor.length+' nomor',result:[]});
					});
				} else 
				{
					return res.json({status:400,message:'Fitur belum tersedia',result:[]});
				}
			});
		}
	});
	}

}
module.exports = new Todo();