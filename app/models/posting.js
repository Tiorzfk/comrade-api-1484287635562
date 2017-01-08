var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PostingSchema = new Schema({
	kategori: String,
	pengirim: String,
	judul: String,
	slug: String,
	deskripsi: String,
	isi: String,
	foto: String,
	status: String,
	tgl_posting: String,
	sumber: String,
	img_old: String,
	lang: String
	
});


mongoose.model("posting", PostingSchema);
