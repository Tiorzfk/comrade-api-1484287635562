var db 	= require('../../config/db').DB;
exports.sentimen = function(req,res,next){
  db.getConnection(function(error,koneksi){
    koneksi.query("SELECT * FROM tweet_support  WHERE klasifikasi='positif' ORDER BY id DESC",function(err,rows){
      if(err)
        res.json({status:400,message:err.code,result:[]});
      else
        res.json({status:200,message:'success',result:rows});
    });
  koneksi.release();
  });
};
