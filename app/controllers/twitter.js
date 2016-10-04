var db 	= require('../../config/db');

function Todo() {

this.sentimen = function(req,res,next){
  db.acquire(function(err,con){
    if (err) throw err;
    con.query("SELECT * FROM tweet_support  WHERE klasifikasi='positif' ORDER BY id DESC",function(err,rows){
      con.release();
      if(err)
        res.json({status:400,message:err.code,result:[]});
      else
        res.json({status:200,message:'success',result:rows});
    });
  });
};

}
module.exports = new Todo();
