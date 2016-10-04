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

}

module.exports = new Todo();
