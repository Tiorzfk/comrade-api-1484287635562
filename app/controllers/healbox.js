var db = require('../../config/db');

function Todo() {

this.reminder = function(req,res,next){
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT * FROM reminderHealbox', function(err,data){
			con.release();
			if(err){
                res.json({status:'400',message:err.code,result:[]});
            }else if(!data.length){
                res.json({status:'400',message: 'Data not found',result:'Failed'})
            }
            res.json({status:'200',message:'success',result:data});
		});
	});
}

this.reminderPost = function (req,res,next) {
	 db.acquire(function(err,con){

	 });
};

this.updateID = function (req,res,next) {
	var data = {
			id_user : req.body.id_user
	}
	var id = req.body.id_healbox;
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('UPDATE healbox SET ? WHERE id_healbox='+id,data, function(err,data){
			 con.release();
			 if(err)
				return res.json({status:400,message:err.code,result:[]});

			 if(!data.affectedRows)
			 	return res.json({status:400,message:'ID Healbox not found',result:[]});

				return res.json({status:200,message:'success update id user'});
		});
	});
};

}

module.exports = new Todo();
