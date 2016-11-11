var db 	= require('../../config/db');
var Twitter = require('twitter');
var request = require('request');
var Sync = require('Sync');
var client = new Twitter({
	consumer_key : '2Hmx6UXuxlRn7TicxrbTy1H2Q',
	consumer_secret:'qgBVhwADPDKpljlTeS6HMF14PV64DNDNfvJykHvhDLMV5vutdf',
	access_token_key:'126856000-00PtloL3L0uSZtlVyHOyUcjG4vQi5oohXfpImHlh',
	access_token_secret:'KD5frjkG43GuSCvRVmDBycAxEXG5Bfr88KeH5GHDtEsSd'
});

var ambiltweet = function(){
	client.get('search/tweets',{q:'hiv aids',lang:'id'},function(error,tweets,response){
    var status = tweets.statuses;
	db.acquire(function(err,con){
    status.forEach(function(item){
        if(err) throw err;
        con.query("select * from tweet_support where id=?",item.id_str,function(err,rows){
          if(err)
            throw err;
            if(rows.length == 0)
            {
                var data = {
                 id : item.id_str,
                 screen_name:item.user.screen_name,
                 text :item.text,
                 profile_image_url  : item.user.profile_image_url,
                 profile_link_color : item.user.profile_link_color,
        				 status:'baru',
        				 status_token:'0'
                }
                console.log(data);
                con.query("insert into tweet_support set ?",data,function(err){
				  if(err)
                    throw err;
                });
            }
        });
      });
	  con.release();
    });
	});
}

var prediksi = function() {
	request('http://naivebayes.azurewebsites.net/prediksi.php', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		//console.log(body);
	  }
	});
}
//setInterval(ambiltweet,60000);
//setInterval(prediksi,62000);
function Todo() {

this.sentimenbak = function(req,res,next){
  db.acquire(function(err,con){
    if (err) throw err;
    con.query("SELECT * FROM tweet_support  WHERE klasifikasi='positif' and status='selesai' ORDER BY id DESC",function(err,rows){
      con.release();
      if(err)
        res.json({status:400,message:err.code,result:[]});
      else
        res.json({status:200,message:'success',result:rows});
    });
  });
};

this.sentimen = function(req, res, next) {
	db.acquire(function(err,con){

		if (err) throw err;
		var limit = 8;
		var page = req.params.page;
		var offset = (page - 1)  * limit;
		var jml = 0;

		var sqljum = "SELECT COUNT(*) as jml FROM tweet_support where klasifikasi='positif' and status='selesai'";
		var sql ="SELECT * from tweet_support where klasifikasi='positif' and status='selesai' ORDER BY id DESC LIMIT "+limit+" OFFSET "+offset;

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
							return res.json({status:200,total_page:total_page,message:'success',result:data});
						}
    		});
			});
		});
};
}
module.exports = new Todo();
