var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EventSchema = new Schema({
	pengirim: String,
	nama: String,
	tempat: String,
	deskripsi: String,
	foto: String,
	tgl_posting: String,
	tgl_mulai: String,
	tgl_berakhir: String,
	longitude: Number,
	latitude: Number,
	kontak_person: String,
    type:String,
    status:String
});

mongoose.model("event", EventSchema);
