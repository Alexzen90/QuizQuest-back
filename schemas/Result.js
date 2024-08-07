const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const ResultSchema = mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  quiz_id: {
    type: ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

module.exports = ResultSchema