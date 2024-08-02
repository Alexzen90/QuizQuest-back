const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const QuizSchema = mongoose.Schema({
  user_id: {
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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