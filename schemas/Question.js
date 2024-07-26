const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId


const questionSchema = mongoose.Schema({
  categorie_id: {
    type: ObjectId,
    ref: 'Categorie',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date
  }
})

module.exports = questionSchema