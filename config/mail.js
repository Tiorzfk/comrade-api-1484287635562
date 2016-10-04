var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tiorezafebrian@gmail.com',
    pass: 'bismilah123'
  }
});

module.exports.transport = transport;