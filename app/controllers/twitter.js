var db 	= require('../../config/db');
var Twitter = require('twitter');
var request = require('request');

var client = new Twitter({
	consumer_key : '2Hmx6UXuxlRn7TicxrbTy1H2Q',
	consumer_secret:'qgBVhwADPDKpljlTeS6HMF14PV64DNDNfvJykHvhDLMV5vutdf',
	access_token_key:'126856000-00PtloL3L0uSZtlVyHOyUcjG4vQi5oohXfpImHlh',
	access_token_secret:'KD5frjkG43GuSCvRVmDBycAxEXG5Bfr88KeH5GHDtEsSd'
});

var ambiltweet = function(){
	client.get('search/tweets',{q:'hiv aids',lang:'id'},function(error,tweets,response){
		var data = JSON.parse(tweets);
		console.log(data.);
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
                 profile_image_url : item.user.profile_image_url,
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

this.sentimen = function(req,res,next){
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

this.ambiltweet = function(req,res) {
  client.get('search/tweets',{q:'hiv aids',lang:'id'},function(error,tweets,response){
    
    res.send(tweets.statuses[0]);

});
};

}
module.exports = new Todo();
