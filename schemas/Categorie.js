const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId


const CategorieSchema = mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: 'User',
    results: {
      type: String,
      default: '0/10'
    }
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date
  }
});

module.exports = CategorieSchema