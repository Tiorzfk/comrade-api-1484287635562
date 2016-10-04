var db = require('../../config/db');

function Todo() {
this.posting = function(req, res, next) {
    db.acquire(function(err,con){
      if (err) throw err;
        con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" ORDER BY tgl_posting', function(err,data){
            con.release();
            if(err){
                return res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            return res.json({status:'200',message:'success',tes:'hay',result:data});
        });
    });

};

this.postingID = function(req, res, next) {
    db.acquire(function(err,con){
      if (err) throw err;
        con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND id_posting='+req.params.id, function(err,data){
          con.release();
            if(err){
                return res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                return res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            return res.json({status:'200',message:'success',result:data});
        });
    });
};

this.kategori = function(req, res, next) {
    db.acquire(function(err,con){
      if (err) throw err;
        if(isNaN(req.params.kategori)) {
            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.nama="'+req.params.kategori+'" ORDER BY tgl_posting DESC', function(err,data){
                con.release();
                if(err){
                  return res.json({status:'400',message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:'400',message: 'Data not found',result:'Failed'})
                }
                return res.json({status:'200',message:'success',result:data});
            });
        } else {
            con.query('SELECT id_posting,kategori.nama as kategori,admin.nama as pengirim,judul,deskripsi,isi,foto,posting.status,tgl_posting FROM posting INNER JOIN kategori on kategori.id_kategori=posting.id_kategori INNER JOIN admin on admin.id_admin=posting.id_admin WHERE posting.status="1" AND kategori.id_kategori='+req.params.kategori+' ORDER BY tgl_posting DESC', function(err,data){
              con.release();
               if(err){
                return res.json({status:'400',message:err.code,result:[]});
                }else if(!data.length){
                    return res.json({status:'400',message: 'Data not found',result:'Failed'})
                }
                return res.json({status:'200',message:'success',result:data});
            });
        }
    });
};
}
module.exports = new Todo();
