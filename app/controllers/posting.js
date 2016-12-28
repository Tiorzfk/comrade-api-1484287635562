var db = require('../../config/db');
var moment = require('moment');
var Sync = require('sync');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var http = require('http');
var striptags = require('striptags');
var AES = require('./AES');

function Todo() {

function rssLiputan(req,res2,next) {
  parser.on('error', function(err) { console.log('Parser error', err); });

 var data = '';
 http.get('http://feed.liputan6.com/rss2?tag=hiv', function(res) {
     if (res.statusCode >= 200 && res.statusCode < 400) {
       res.on('data', function(data_) { data += data_.toString(); });
       res.on('end', function() {
         parser.parseString(data, function(err, result) {
           db.acquire(function(err,con){
             if (err) throw err;
             var arrayisi = striptags(result.rss.channel[0].item[0].description[0]).split(' ');
             var sliceisi = arrayisi.slice(0,17);
             var dataposting = {
               //id : result.rss.channel[0].item[0].guid[0]._,
               judul : result.rss.channel[0].item[0].title[0],
               deskripsi : sliceisi.join(' '),
               isi : result.rss.channel[0].item[0].description[0],
               foto : result.rss.channel[0].item[0]['media:thumbnail'][0].$.url,
               status : '0',
               id_kategori : 1,
               id_admin : 1,
               lang : 'id',
               tgl_posting : moment().format('YYYY-MM-DD h:mm:ss'),
               sumber : result.rss.channel[0].item[0].link[0]
             }
             con.query('SELECT * FROM posting WHERE judul="'+dataposting.judul+'"',function(err,data){
               if(!data.length){
                 con.query('INSERT INTO posting SET ?',dataposting,function(err,data){
                   con.release();
                   if (err) throw err;

                   //console.log('Berhasil menambah data');
                 });
               //}else{
                 //console.log('data sudah ada');
               }
             });
           });
           //return res2.json([data]);
         });
       });
     }
   });
}

function rssSciencedaily(req, res2, next) {
  parser.on('error', function(err) { console.log('Parser error', err); });

 var data = '';
 http.get('http://rss.sciencedaily.com/health_medicine/hiv_and_aids.xml', function(res) {
     if (res.statusCode >= 200 && res.statusCode < 400) {
       res.on('data', function(data_) { data += data_.toString(); });
       res.on('end', function() {
         parser.parseString(data, function(err, result) {
           db.acquire(function(err,con){
             if (err) throw err;
             var arrayisi = striptags(result.rss.channel[0].item[0].description[0]).split(' ');
             var sliceisi = arrayisi.slice(0,17);
             var foto = result.rss.channel[0].item[0]['media:thumbnail'];
             if(!foto){
               foto = 'http://cdn0-a.production.liputan6.static6.com/medias/1293020/big/005371100_1468993189-Ribbon1__avert_org_.jpg';
             }else{
               foto = result.rss.channel[0].item[0]['media:thumbnail'][0].$.url;
             }
             var dataposting = {
               //id : result.rss.channel[0].item[0].guid[0]._,
               judul : result.rss.channel[0].item[0].title[0],
               deskripsi : sliceisi.join(' '),
               isi : result.rss.channel[0].item[0].description[0],
               foto : foto,
               status : '0',
               id_kategori : 2,
               id_admin : 1,
               lang : 'en',
               tgl_posting : moment().format('YYYY-MM-DD h:mm:ss'),
               sumber : result.rss.channel[0].item[0].guid[0]._
             }
             //return res2.json(moment().format('YYYY-MM-DD'));

             con.query('SELECT * FROM posting WHERE judul="'+dataposting.judul+'"',function(err,data){
               if(!data.length){
                 con.query('INSERT INTO posting SET ?',dataposting,function(err,data){
                   con.release();
                   if (err) throw err;
                      //console.log(err);

                   //console.log('Berhasil menambah data');
                 });
              //  }else{
              //    console.log('data sudah ada');
              }
             });
           });
           //return res2.json([data]);
         });
       });
     }
   });
}

function rssMedicalxpress(req, res2, next) {
  parser.on('error', function(err) { console.log('Parser error', err); });

 var data = '';
 http.get('http://medicalxpress.com/rss-feed/hiv-aids-news', function(res) {
     if (res.statusCode >= 200 && res.statusCode < 400) {
       res.on('data', function(data_) { data += data_.toString(); });
       res.on('end', function() {
         parser.parseString(data, function(err, result) {
           db.acquire(function(err,con){
             if (err) throw err;
            //  var arrayisi = striptags(result.rss.channel[0].item[0].description[0]).split(' ');
            //  var sliceisi = arrayisi.slice(0,17);
            //  var dataposting = {
            //    //id : result.rss.channel[0].item[0].guid[0]._,
            //    judul : result.rss.channel[0].item[0].title[0],
            //    deskripsi : sliceisi.join(' '),
            //    isi : result.rss.channel[0].item[0].description[0],
            //    foto : result.rss.channel[0].item[0]['media:thumbnail'][0].$.url,
            //    status : '0',
            //    id_kategori : 1,
            //    id_admin : 1,
            //    lang : 'en',
            //    tgl_posting : moment().format('YYYY-MM-DD h:mm:ss'),
            //    sumber : result.rss.channel[0].item[0].link[0]
            //  }
             return console.log(result);

            //  con.query('SELECT * FROM posting WHERE judul="'+dataposting.judul+'"',function(err,data){
            //    if(!data.length){
            //      con.query('INSERT INTO posting SET ?',dataposting,function(err,data){
            //        con.release();
            //        if (err) throw err;
             //
            //        //console.log('Berhasil menambah data');
            //      });
            //    //}else {
            //      //console.log('data sudah ada');
            //    }
            //  });
           });
           //return res2.json([data]);
         });
       });
     }
   });
}

function rssAidsMap(req, res2, next) {
  parser.on('error', function(err) { console.log('Parser error', err); });

 var data = '';
 http.get('http://www.aidsmap.com/Aidsmap-news-English/page/1260794', function(res) {
     if (res.statusCode >= 200 && res.statusCode < 400) {
       res.on('data', function(data_) { data += data_.toString(); });
       res.on('end', function() {
         parser.parseString(data, function(err, result) {
           db.acquire(function(err,con){
             if (err) throw err;
             var arrayisi = striptags(result.rss.channel[0].item[0].description[0]).split(' ');
             var sliceisi = arrayisi.slice(0,17);
             var foto = result.rss.channel[0].item[0]['media:thumbnail'];
             if(!foto){
               foto = 'http://cdn0-a.production.liputan6.static6.com/medias/1293020/big/005371100_1468993189-Ribbon1__avert_org_.jpg';
             }else{
               foto = result.rss.channel[0].item[0]['media:thumbnail'][0].$.url;
             }
             var dataposting = {
               //id : result.rss.channel[0].item[0].guid[0]._,
               judul : result.rss.channel[0].item[0].title[0],
               deskripsi : sliceisi.join(' '),
               isi : result.rss.channel[0].item[0].description[0],
               foto : foto,
               status : '0',
               id_kategori : 1,
               id_admin : 1,
               lang : 'en',
               tgl_posting : moment().format('YYYY-MM-DD h:mm:ss'),
               sumber : result.rss.channel[0].item[0].link[0]
             }
             //return console.log(dataposting);

             con.query('SELECT * FROM posting WHERE judul="'+dataposting.judul+'"',function(err,data){
               if(!data.length){
                 con.query('INSERT INTO posting SET ?',dataposting,function(err,data){
                   con.release();
                   if (err) throw err;

                   //console.log('Berhasil menambah data');
                 });
               //}else {
                 //console.log('data sudah ada');
               }
             });
           });
           //return res2.json([data]);
         });
       });
     }
   });
}

//900000
//  setInterval(rssLiputan, 900000);
//  setInterval(rssSciencedaily, 900000);
//setInterval(rssMedicalxpress, 3000);
//  setInterval(rssAidsMap, 900000);

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
        var limit = 8;
        var page = req.params.page;
        //var offset = (page - 1)  * limit;
        var offset = page;
        Sync(function(){
          jml_posting.sync();
          con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" ORDER BY tgl_posting LIMIT '+limit+' OFFSET '+offset, function(err,data){
              //con.release();
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
        con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber,slug FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND id_posting='+req.params.id, function(err,data){
          con.release();
            if(err){
                return res.json({status:400,url:url,message:err.code,result:[]});
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

        if(isNaN(req.params.kategori)) {

              con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber,slug FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.nama="'+req.params.kategori+'" ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
                con.release();
                  if(err){
                    return res.json({status:400,message:err.code,result:[]});
                  }else if(!data.length){
                      return res.json({status:404,message: 'Data not found',result:[]})
                  }
                  return res.json({status:200,message:'success',result:data});
              });

        } else {

            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber,slug FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.id_kategori='+req.params.kategori+' ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
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

this.kategoriAll = function(req, res, next) {
    db.acquire(function(err,con){
      if (err) throw err;
        if(isNaN(req.params.kategori)) {

              con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.nama="'+req.params.kategori+'" ORDER BY tgl_posting DESC', function(err,data){
                con.release();
                  if(err){
                    return res.json({status:400,message:err.code,result:[]});
                  }else if(!data.length){
                      return res.json({status:404,message: 'Data not found',result:[]})
                  }
                  return res.json({status:200,message:'success',result:data});
              });
        } else {
            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.id_kategori='+req.params.kategori+' ORDER BY tgl_posting DESC', function(err,data){
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

this.postLang = function(req, res, next) {
    db.acquire(function(err,con){
      if (err) throw err;
        var limit = 8;
        var page = req.params.page;
        //var offset = (page - 1)  * limit;
        var offset = page;
        var jml = 0;
        // function jml_posting(callback) {
        //     con.query('SELECT COUNT(*) as jml FROM posting WHERE status="1" AND id_kategori="'+req.params.kategori+'" AND lang="'+req.params.lang+'"',function(err,data){
        //       con.release();
        //       if(err)
        //         return res.json({status:400,message:err.code,result:[]})
        //
        //         jml = data[0].jml;
        //         callback(null,jml);
        //     });
        // }
        if(isNaN(req.params.kategori)) {
            // Sync(function(){
              con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.nama="'+req.params.kategori+'" AND lang="'+req.params.lang+'" ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
                con.release();
                  if(err){
                    return res.json({status:400,message:err.code,result:[]});
                  }else if(!data.length){
                      return res.json({status:404,message: 'Data not found',result:[]})
                  }
                  return res.json({status:200,message:'success',result:data});
              });
            // });
        } else {
          // Sync(function(){
          //   jml_posting.sync();

            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting,sumber FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.id_kategori='+req.params.kategori+' AND lang="'+req.params.lang+'" ORDER BY tgl_posting DESC LIMIT '+limit+' OFFSET '+offset, function(err,data){
              //  var total_page = Math.ceil(jml / limit);
              con.release();
               if(err){
                return res.json({status:400,message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:404,message: 'Data not found',result:[]})
                }
                return res.json({status:200,message:'success',result:data});
            });
          // });
        }
    });
};

}
module.exports = new Todo();
