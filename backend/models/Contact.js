const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
});

module.exports = mongoose.model('Contact', ContactSchema);
