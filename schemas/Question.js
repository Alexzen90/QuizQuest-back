const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId


const QuestionSchema = mongoose.Schema({
  categorie_id: {
    type: ObjectId,
    ref: 'Categorie',
    required: true
  },
  question: {
    type: String,
    required: true,
    unique: true
  },
  difficulty: {
    type: String,
    required: true
  },
  correct_answer: {
    type: String,
    required: true
  },
  incorrect_answers: {
    type: [String],
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

module.exports = QuestionSchema