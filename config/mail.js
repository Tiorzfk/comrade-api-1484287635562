var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // user: 'tiorezafebrian@gmail.com',
    // pass: 'bismilah123'
    user: 'comradesapp@gmail.com',
    pass: 'code@labs'
  }
});

module.exports.transport = transport;