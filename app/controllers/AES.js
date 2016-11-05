var crypto = require('crypto');
//konfigurasi

//public key : comrade@codelabs
module.exports.encrypt = function(text,key){
  //var key = "comrade@codelabs";
  var cipher = crypto.createCipher('aes-128-ecb',key);
  var hasil = cipher.update(text.toString(),'utf-8','hex');
  hasil += cipher.final('hex');
  return hasil;
}

module.exports.decrypt = function(text,key) {
  var decipher = crypto.createDecipher('aes-128-ecb',key);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
