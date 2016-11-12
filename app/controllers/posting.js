var db = require('../../config/db');
var Pusher = require('pusher');
var Sync = require('sync');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var http = require('http');

function Todo() {

function cekLiputan(req,res2,next) {
  parser.on('error', function(err) { console.log('Parser error', err); });

 var data = '';
 http.get('http://feed.liputan6.com/rss2?tag=hiv', function(res) {
     if (res.statusCode >= 200 && res.statusCode < 400) {
       res.on('data', function(data_) { data += data_.toString(); });
       res.on('end', function() {
         parser.parseString(data, function(err, result) {
           db.acquire(function(err,con){
             if (err) throw err;
             var data = {
               id : result.rss.channel[0].item[0].guid[0]._,
               judul : result.rss.channel[0].item[0].title[0],
               isi : result.rss.channel[0].item[0].description[0],
               foto : result.rss.channel[0].item[0]['media:thumbnail'][0].$.url,
               status : '0',
               id_kategori : 1,
               id_admin : 1,
               tgl_posting : result.rss.channel[0].item[1].pubDate[0]
             }
             con.query('SELECT * FROM posting WHERE id_posting='+data.id,function(err,data){
               if(!data.length){
                 con.query('',function(err,data){

                 })
               }
             });
           });
           //return res2.json([data]);
         });
       });
     }
   });
}

//setInterval(cekLiputan, 60000);

this.posting = function(req, res, next) {
    var jml = 0;
    db.acquire(function(err,con){
      function jml_posting(callback) {
          con.query('SELECT COUNT(*) as jml FROM posting WHERE status="1"',function(err,data){
            con.release();
            if(err)
              return res.json({status:400,message:err.code,result:[]})

              jml = data[0].jml;
              callback(null,jml);
          });
      }
      if (err) throw err;
        // 1 2 3 4  5
        // 0 8 16 24 32
        var limit = 8;
        var page = req.params.page;
        //var offset = (page - 1)  * limit;
        var offset = page;
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
        //con.release();
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
        //var offset = (page - 1)  * limit;
        var offset = page;
        var jml = 0;
        function jml_posting(callback) {
            con.query('SELECT COUNT(*) as jml FROM posting WHERE status="1" AND id_kategori="'+req.params.kategori+'"',function(err,data){
              con.release();
              if(err)
                return res.json({status:400,message:err.code,result:[]})

                jml = data[0].jml;
                callback(null,jml);
            });
        }
        if(isNaN(req.params.kategori)) {
            Sync(function(){
              con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.nama="'+req.params.kategori+'" ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
                  if(err){
                    return res.json({status:400,message:err.code,result:[]});
                  }else if(!data.length){
                      return res.json({status:404,message: 'Data not found',result:[]})
                  }
                  return res.json({status:200,message:'success',result:data});
              });
            });
        } else {
          Sync(function(){
            jml_posting.sync();

            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.id_kategori='+req.params.kategori+' ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
               var total_page = Math.ceil(jml / limit);

               if(err){
                return res.json({status:400,message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:404,message: 'Data not found',result:[]})
                }
                return res.json({status:200,total_page:total_page,message:'success',result:data});
            });
          });
        }
    });
};
}
module.exports = new Todo();
