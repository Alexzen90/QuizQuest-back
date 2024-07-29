/* Connexion à la base de données */
require('../utils/database')
const mongoose = require('mongoose')

// describe("UserService", () => {
//   require('./services/UserService.test')
// })

// describe("UserController", () => {
//   require('./controllers/UserController.test')
// })

// describe("CategorieService", () => {
//   require('./services/CategorieService.test')
// })

// describe("CategorieController", () => {
//   require('./controllers/CategorieController.test')
// })

// describe("QuestionService", () => {
//   require('./services/QuestionService.test')
// })

// describe("QuestionController", () => {
//   require('./controllers/QuestionController.test')
// })

describe("QuizService", () => {
  require('./services/QuizService.test') 
})

// describe("API - Mongo", () => {
//   it("vider les dbs. -S", () => {
//     if (process.env.npm_lifecycle_event == 'test') {
//       mongoose.connection.db.dropDatabase()
//     }
//   })
// })

