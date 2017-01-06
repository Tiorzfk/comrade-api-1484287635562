var mongoose = require('mongoose');
var Schema =  mongoose.Schema;
TweettrainSchema = new Schema({
  id_tweet:String,
  id_string :String,
  screen_name:String,
  text:String,
  profile_image_url:String,
  created_at:Date, 
  klasifikasi:String,
  profile_link_color:String,
  status:String,
  words:[String],
  statusToken:Number,
});

mongoose.model("Tweetmining",TweettrainSchema);
