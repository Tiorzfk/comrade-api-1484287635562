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

}

module.exports = new Todo();
