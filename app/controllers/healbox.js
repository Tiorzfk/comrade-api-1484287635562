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
			 	return res.json({status:404,message:'ID Healbox not found',result:[]});

				return res.json({status:200,message:'success update id user'});
		});
	});
};

this.arv_reminder = function (req,res,next) {
	var data = {
			id_healbox : req.body.id_healbox,
			idarvtype : req.body.idarvtype,
			tipearv : req.body.tipearv,
			warnaLabel : req.body.warnaLabel,
			kategori_jam : req.body.kategori_jam,
			starthour : req.body.starthour,
			startminute : req.body.startminute,
			totalDetikStart : req.body.totalDetikStart,
			idPiStart : req.body.idPiStart,
			middlehour : req.body.middlehour,
			middleminute : req.body.middleminute,
			totalDetikMiddle : req.body.totalDetikMiddle,
			idPiMiddle : req.body.idPiMiddle,
			endhour : req.body.endhour,
			endminute : req.body.endminute,
			totalDetikEnd : req.body.totalDetikEnd,
			idPiEnd : req.body.idPiEnd
	}
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('INSERT INTO arv_reminder SET ?',data, function(err,data){
			 con.release();
			 if(err)
				return res.json({status:400,message:err.code,result:[]});

				return res.json({status:200,message:'success insert new reminder arv'});
		});
	});
};

this.put_arv_reminder = function (req,res,next) {
	var data = {
			id_healbox : req.body.id_healbox,
			idarvtype : req.body.idarvtype,
			tipearv : req.body.tipearv,
			warnaLabel : req.body.warnaLabel,
			kategori_jam : req.body.kategori_jam,
			starthour : req.body.starthour,
			startminute : req.body.startminute,
			totalDetikStart : req.body.totalDetikStart,
			idPiStart : req.body.idPiStart,
			middlehour : req.body.middlehour,
			middleminute : req.body.middleminute,
			totalDetikMiddle : req.body.totalDetikMiddle,
			idPiMiddle : req.body.idPiMiddle,
			endhour : req.body.endhour,
			endminute : req.body.endminute,
			totalDetikEnd : req.body.totalDetikEnd,
			idPiEnd : req.body.idPiEnd
	}
	var id = req.params.id;
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('UPDATE arv_reminder SET ? WHERE id='+id,data, function(err,data){
			 con.release();
			 if(err)
				return res.json({status:400,message:err.code,result:[]});
			 if(!data.affectedRows)
 			 	return res.json({status:404,message:'ID not found',result:[]});

				return res.json({status:200,message:'success update reminder arv'});
		});
	});
};

this.healboxID = function(req,res,next) {
	var id = req.params.id_user;
	db.acquire(function(err,con){
		if (err) throw err;
		con.query('SELECT id_healbox FROM healbox WHERE id_user='+id, function(err,data){
			 con.release();
			 if(err)
				return res.json({status:400,message:err.code,result:[]});
			 if(!data.length)
 			 	return res.json({status:404,message:'ID not found',result:[]});

				return res.json({status:200,message:'success',result:data});
		});
	});
}

this.del_arv_reminder = function(req, res, next) {
    var id = req.params.id;
    db.acquire(function(err,con){
		
			con.query('DELETE FROM arv_reminder WHERE id='+id,function(err,data){
				con.release();
				if(err)
					return res.json({status:400,message:err});

				if(!data.affectedRows)
					return res.json({status:400,message:'id not found'});
				
				return res.json({status:200,message:'Success delete data'});

			});

    });
};

}

module.exports = new Todo();
