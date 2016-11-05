var db = require('../../config/db');
var Pusher = require('pusher');
var Sync = require('sync');

function Todo() {
this.posting = function(req, res, next) {
    var jml = 0;
    db.acquire(function(err,con){
      function jml_posting(callback) {
          con.query('SELECT * FROM posting WHERE status="1"',function(err,data){
            con.release();
            if(err)
              return res.json({status:400,message:err.code,result:[]})

              jml = data.length;
              callback(null,jml);
          });
      }
      if (err) throw err;
        // 1 2 3 4  5
        // 0 8 16 24 32
        var limit = 8;
        var page = req.params.page;
        var offset = (page - 1)  * limit;
        Sync(function(){
          jml_posting.sync();

          con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset, function(err,data){

              var total_page = Math.ceil(jml / limit);
              if(err){
                  return res.json({status:400,message:err.code,result:[]});
              }else if(!data.length){
                  return res.json({status:404,message: 'Data not found',result:[]})
              }
              return res.json({status:200,total_page:total_page,message:'success',result:data});
          });
        });
    });

};

this.postingID = function(req, res, next) {
    db.acquire(function(err,con){
      if (err) throw err;
        con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND id_posting='+req.params.id, function(err,data){
          con.release();
            if(err){
                return res.json({status:400,message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:404,message: 'Data not found',result:[]})
            }
            return res.json({status:200,message:'success',result:data});
        });
    });
};

this.kategori = function(req, res, next) {
    db.acquire(function(err,con){
      if (err) throw err;
        var limit = 8;
        var page = req.params.page;
        var offset = (page - 1)  * limit;
        if(isNaN(req.params.kategori)) {
            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.nama="'+req.params.kategori+'" ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
                con.release();
                if(err){
                  return res.json({status:400,message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:404,message: 'Data not found',result:[]})
                }
                return res.json({status:200,message:'success',result:data});
            });
        } else {
            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.id_kategori='+req.params.kategori+' ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
              con.release();
               if(err){
                return res.json({status:400,message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:404,message: 'Data not found',result:[]})
                }
                return res.json({status:200,message:'success',result:data});
            });
        }
    });
};
}
module.exports = new Todo();
