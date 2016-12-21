var db = require('../../config/db');

function Todo() {

this.banner = function(req,res,next) {
	db.acquire(function(err,con){
		if (err) throw err;

		con.query('SELECT * FROM banner ORDER BY id_banner DESC LIMIT 5', function(err,data){
			con.release();
			if(err)
				return res.json({status:'400',message:err.code,result:[]});

			return res.json({status:'200',message:'success',result:data});

		});
	});
};

this.postBanner = function(req,res,next) {
    var data = {
      nama_banner : req.body.nama_banner,
      banner_img : req.body.banner_img
    }
		db.acquire(function(err,con){
      if (err) throw err;
      con.query('INSERT INTO banner SET ?',data,function(err,data){
				con.release();
        if(err)
          return res.json(err)

        return res.json({
          result: 'Success',
          status: 200,
          message: 'Banner berhasil disimpan.'
        });

      });
		});
}

}

module.exports = new Todo();
