const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

module.exports = userSchema