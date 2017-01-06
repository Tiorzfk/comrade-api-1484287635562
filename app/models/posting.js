var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PostingSchema = new Schema({
	nama_kategori: String,
	nama_admin: String,
	judul: String,
	slug: String,
	deskripsi: String,
	isi: String,
	foto: String,
	status: String,
	tgl_posting: String,
	sumber: String,
	lang: String,
	
});


mongoose.model("posting", PostingSchema);
