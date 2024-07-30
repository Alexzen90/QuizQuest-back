const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const QuizSchema = mongoose.Schema({
  created_by: {
    type: ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  categorie: {
    type: String,
    required: true
  },
  question1: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question2: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question3: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question4: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question5: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question6: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question7: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question8: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question9: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  question10: {
    difficulty: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: {
      type: [String],
      required: true,
      validate: [
        function(value) {
          return Array.isArray(value) && value.length === 3;
        },
        'le champ doit contenir 3 éléments séparés par une virgule et un espace(exemple: chat, chien, souris).'
      ]
    }
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date
  }
})

module.exports = QuizSchema