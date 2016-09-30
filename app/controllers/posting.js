var db = require('../../config/db').DB;

exports.posting = function(req, res, next) {
    db.getConnection(function(err,koneksi){
      if (err) throw err;
        koneksi.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" ORDER BY tgl_posting', function(err,data){
            if(err){
                return res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            return res.json({status:'200',message:'success',result:data});
        });
        koneksi.release();
    });

};

exports.postingID = function(req, res, next) {
    db.getConnection(function(err,koneksi){
      if (err) throw err;
        koneksi.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND id_posting='+req.params.id, function(err,data){
            if(err){
                return res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            return res.json({status:'200',message:'success',result:data});
        });
        koneksi.release();
    });
};

exports.kategori = function(req, res, next) {
    db.getConnection(function(err,koneksi){
      if (err) throw err;
        if(isNaN(req.params.kategori)) {
            koneksi.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.nama="'+req.params.kategori+'" ORDER BY tgl_posting DESC', function(err,data){
                if(err){
                return res.json({status:'400',message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:'400',message: 'Data not found',result:'Failed'})
                }
                return res.json({status:'200',message:'success',result:data});
            });
            koneksi.release();
        } else {
            koneksi.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.id_kategori='+req.params.kategori+' ORDER BY tgl_posting DESC', function(err,data){
               if(err){
                return res.json({status:'400',message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:'400',message: 'Data not found',result:'Failed'})
                }
                return res.json({status:'200',message:'success',result:data});
            });
            koneksi.release();
        }
    });
};
