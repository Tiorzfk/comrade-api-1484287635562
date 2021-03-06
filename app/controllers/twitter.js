var db 	= require('../../config/db');
var Twitter = require('twitter');
var request = require('request');
var Sync = require('Sync');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var multer  = require('multer');
var transport = require('../../config/mail').transport;
var EmailTemplates = require('swig-email-templates');
var AES = require('./AES');
const path = require('path');
const fs = require('fs');
//var mongoose = require('mongoose');
// var tweetmining = require('../models/twitter');
var tweetmining = require('mongoose').model('Tweetmining');

//setting twitter client
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
    if (err) throw err;
    status.forEach(function(item){
        if(err) throw err;
        con.query("select * from tweet_support where id_string=?",item.id_str,function(err,rows){
          con.release();
          if(err)
            throw err;
            if(rows.length == 0)
            {
                var data = {
                 id_string : item.id_str,
                 screen_name:item.user.screen_name,
                 text :item.text,
                 profile_image_url  : item.user.profile_image_url,
                 profile_link_color : item.user.profile_link_color,
        				 status:'baru',
        				 status_token:'0'
                }
                con.query("insert into tweet_support set ?",data,function(err){
                  if(err)
                          throw err;
                  else 
                    console.log(data);
                });
            }
        });
      });
    });
	});
}

var ambileng = function(){
	client.get('search/tweets',{q:'hiv aids',lang:'en'},function(error,tweets,response){
    var status = tweets.statuses;
	db.acquire(function(err,con){
    if (err) throw err;
    status.forEach(function(item){
        if(err) throw err;
        con.query("select * from train_eng where id=?",item.id_str,function(err,rows){
          con.release();
          if(err) throw err;
            if(rows.length == 0)
            {
                var data = {
                 id : item.id_str,
                 screen_name:item.user.screen_name,
                 text :item.text,
                 profile_image_url  : item.user.profile_image_url,
                 profile_link_color : item.user.profile_link_color
                }
                console.log(data);
                con.query("insert into train_eng set ?",data,function(err){
				  				  if(err)
                      console.log('Error');
                });
            }
        });
      });
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
setInterval(prediksi,62000);
//setInterval(ambileng,5000);

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
	    //var offset = (page - 1)  * limit;
		var offset = page;
		var jml = 0;

		var sqljum = "SELECT COUNT(*) as jml FROM tweet_support where klasifikasi='positif' and status='selesai'";
		var sql ="SELECT * from tweet_support where klasifikasi='positif' and status='selesai' LIMIT "+limit+" OFFSET "+offset;

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

this.sentiment_eng=function(req,res){
  db.acquire(function(err,con){
    if (err) throw err;
    var limit = 8;
    var page = req.params.page;
      //var offset = (page - 1)  * limit;
    var offset = page;
    var jml = 0;

    var sqljum = "SELECT COUNT(*) as jml FROM train_eng where klasifikasi='positif'";
    var sql ="SELECT * from train_eng where klasifikasi='positif' ORDER BY id DESC LIMIT "+limit+" OFFSET "+offset;

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
}

this.ambil_eng2 = function(req,res){
  var limit = 8;
  var page = req.params.page;
  //var offset = (page - 1)  * limit;
  var offset = parseInt(page);
  tweetmining.find({$or:[{status:"train"},{status:"selesai"}],klasifikasi:"positif"})
    .skip(offset)
    .limit(limit).exec(function(err,doc){
      if(err)
        return res.json({status:400,message:err,result:[]});
          else if(!doc.length)
            return res.json({status:400,message: 'Data not found',result:[]})
      else
        return res.json({status:200,total_page:0,message:'success',result:doc});
  });
}

this.ambiltweet = function(req,res){
	client.get('search/tweets',{q:'hiv aids',lang:'id'},function(error,tweets,response){
    res.send(tweets.statuses);
  });
}

this.coba = function(req,res) {
		var password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
		res.send(password);
}

this.listtweetsId = function(req, res, next) {
    db.acquire(function(err,con){
      con.query('SELECT id_string,status,screen_name,text,klasifikasi FROM tweet_support WHERE status="vertifikasi" LIMIT 200',function(err,data){
        con.release();
        if (err) {
           return res.json({status:400,message:err});
        } else {
           return res.json({status:200,message:'success',result:data});            
        }
      });
    });

}
module.exports = new Todo();
