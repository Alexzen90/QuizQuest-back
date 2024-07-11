const mongoose = require('mongoose');

const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }).split(" ").join("-");

const userSchema = mongoose.Schema({
  username: {
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
  },
  created_at: {
    type: String,
    default: date
  },
  updated_at: {
    type: String,
    default: date
  },
  status: {
    type: Boolean,
    default: false
  }
})

module.exports = userSchema