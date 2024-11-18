const mongoose = require('mongoose');

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
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date
  },
  token: {
    type: String
  }
})

module.exports = userSchema