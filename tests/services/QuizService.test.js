const QuizService = require('../../services/QuizService')
const UserService = require('../../services/UserService')
const CategorieService = require('../../services/CategorieService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_quiz_valid = ""
var tab_id_quizzes = []
var tab_id_users = []
let tab_id_categories = []
var quizzes = []

let users = [
    {
        name: "Détenteur de categorie 1",
        username: "oui1",
        email:"iencli1@gmail.com",
        password: "1234"
    },
    {
        name: "Détenteur de categorie 2",
        username: "oui2",
        email:"iencli2@gmail.com",
        password: "1234"
    },
    {
        name: "Détenteur de categorie 3",
        username: "oui3",
        email:"iencli3@gmail.com",
        password: "1234"
    },
    {
        name: "Détenteur de categorie 4",
        username: "oui4",
        email:"iencli4@gmail.com",
        password: "1234"
    },
];

let categories = [
    {
        name: "Le corps humain"
    },
    {
        name: "Les fonds marins"
    },
    {
        name: "Musique"
    },
    {
        name: "Vacances"
    },
];

it("Création des utilisateurs fictif", (done) => {
    UserService.addManyUsers(users, null, function (err, value) {
        tab_id_users = _.map(value, '_id')
        done()
    })
})

it("Authentification d'un utilisateur fictif.", (done) => {
    UserService.loginUser('oui4', "1234", null, function(err, value) {
        valid_token = value.token
        done()
    })
})

it("Création des catégories fictives", (done) => {
    categories = _.map(categories, (e) => {
        e.user_id = rdm_item(tab_id_users)
        return e
    })
  CategorieService.addManyCategories(categories, null, function (err, value) {
      tab_id_categories = _.map(value, '_id')
      done()
  })
})

function rdm_item (tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

describe("addOneQuiz", () => {
    it("Quiz correct. - S", (done) => {
        var quiz = {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "Quiz sur Naruto"
        }
        QuizService.addOneQuiz(quiz, null, function(err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value['name']).to.be.equal('Quiz sur Naruto')
            expect(value).to.haveOwnProperty('user_id')
            expect(value).to.haveOwnProperty('categorie_id')
            id_quiz_valid = value._id
            quizzes.push(value)
            done()
        })
    })
    it("Quiz incorrect. (Sans name) - E", (done) => {
        var quiz_no_valid = {
          user_id: rdm_item(tab_id_users),
          categorie_id: rdm_item(tab_id_categories)
        }
        QuizService.addOneQuiz(quiz_no_valid,  null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
    it("Quiz incorrect. (name vide) - E", (done) => {
        var quiz_no_valid = {
          user_id: rdm_item(tab_id_users),
          categorie_id: rdm_item(tab_id_categories),
          name: ""
        }
        QuizService.addOneQuiz(quiz_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("addManyQuizzes", () => {
  it("Quizzes à ajouter, valide. - S", (done) => {
      var quizzes_tab = [{
        user_id: rdm_item(tab_id_users),
        categorie_id: rdm_item(tab_id_categories),
        name: "test1"
      },
      {
        user_id: rdm_item(tab_id_users),
        categorie_id: rdm_item(tab_id_categories),
        name: "test2"
      },
      {
        user_id: rdm_item(tab_id_users),
        categorie_id: rdm_item(tab_id_categories),
        name: "test3"
      }]

      QuizService.addManyQuizzes(quizzes_tab, null, function (err, value) {
          tab_id_quizzes = _.map(value, '_id')
          quizzes = [...value, ...quizzes]
          expect(value).lengthOf(3)
          done()
      })
  })
  it("Quizzes à ajouter, non valide. (name vide) - E", (done) => {
      var quizzes_tab_error = [{
        user_id: rdm_item(tab_id_users),
        categorie_id: rdm_item(tab_id_categories),
        name: ""
      },
      {
        user_id: rdm_item(tab_id_users),
        categorie_id: rdm_item(tab_id_categories),
        name: "bbbbbbbbbbb"
      },
      {
        user_id: rdm_item(tab_id_users),
        categorie_id: rdm_item(tab_id_categories),
        name: "aaaaa"
      }]

      QuizService.addManyQuizzes(quizzes_tab_error, null, function (err, value) {
          expect(err[0]).to.haveOwnProperty('msg')
          expect(err[0]).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
          expect(err[0]).to.haveOwnProperty('fields')
          expect(err[0]).to.haveOwnProperty('index')
          expect(err[0]['fields']).to.haveOwnProperty('name')
          expect(err[0]['fields']['name']).to.equal('Path `name` is required.')
          expect(err[0]['index']).to.equal(0)
          done()
      })
  })
})

describe("findOneQuizById", () => {
    it("Chercher un quiz existant avec un id correct. - S", (done) => {
        QuizService.findOneQuizById(id_quiz_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher un quiz inexistant avec un id correct. - E", (done) => {
        QuizService.findOneQuizById("6694e40466b1fde90ef8f1f9", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-found')
            done()
        })
    })
    it("Chercher un quiz avec un id invalide. - E", (done) => {
        QuizService.findOneQuizById("6694", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyQuizzesById", () => {
    it("Chercher des quizzes existants. - S", (done) => {
        QuizService.findManyQuizzesById(tab_id_quizzes, null, function (err, value) {
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Chercher des quizzes inexistants ou incorrects. - E", (done) => {
        QuizService.findManyQuizzesById(['110155', '6694e3d6bc85790ed4801278', '61'], null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('fields')
            expect(err['type_error']).to.equal('no-valid')
            expect(err['fields']).to.have.lengthOf(2)
            done()
        })
    })
})

describe("findOneQuiz", () => {
  it("Chercher un quiz par les champs selectionnés. - S", (done) => {
      QuizService.findOneQuiz(["name"], quizzes[0].name, null, function (err, value) {
          expect(value).to.haveOwnProperty('name')
          done()
      })
  })
  it("Chercher un quiz par les champs selectionnés (categorie_id). - S", (done) => {
      QuizService.findOneQuiz(["categorie_id"], quizzes[0].categorie_id, null, function (err, value) {
          expect(value).to.haveOwnProperty('name')
          done()
      })
  })
  it("Chercher un quiz sans tableau de champ. - E", (done) => {
      QuizService.findOneQuiz("name", quizzes[0].name, null, function (err, value) {
          expect(err).to.haveOwnProperty('type_error')
          done()
      })
  })
  it("Chercher un quiz inexistant. - E", (done) => {
      QuizService.findOneQuiz(["name"], "quizzes[0].name", null, function (err, value) {
          expect(err).to.haveOwnProperty('type_error')
          done()
      })
  })
})

describe("findManyQuizzes", () => {
  it("Retourne 3 quizzes - S", (done) => {
      QuizService.findManyQuizzes(null, 3, 1, null, function (err, value) {
          expect(value).to.haveOwnProperty("count")
          expect(value).to.haveOwnProperty("results")
          expect(err).to.be.null
          done()
      })
  })
  it("Faire une recherche avec 0 résultats correspondant - S", (done) => {
      QuizService.findManyQuizzes('couteau', 1, 3, null, function (err, value) {
          expect(value).to.haveOwnProperty("count")
          expect(value).to.haveOwnProperty("results")
          expect(err).to.be.null
          done()
      })
  })
  it("Envoie d'une chaine de caractère a la place de la page - E", (done) => {
      QuizService.findManyQuizzes(null, "coucou", 3, null, function (err, value) {
          expect(err).to.haveOwnProperty("type_error")
          expect(err["type_error"]).to.be.equal("no-valid")
          expect(value).to.undefined
          done()
      })
  })
})

describe("updateOneQuiz", () => {
    it("Modifier un quiz correct. - S", (done) => {
        QuizService.updateOneQuiz(id_quiz_valid, { name: "Animaux" }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('updated_at')
            expect(value['name']).to.be.equal('Animaux')
            done()

        })
    })
    it("Modifier un quiz avec id incorrect. - E", (done) => {
        QuizService.updateOneQuiz("1200", { categorie: "Animaux" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un quiz avec des champs requis vide. - E", (done) => {
        QuizService.updateOneQuiz(id_quiz_valid, { name: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("updateManyQuizzes", () => {
    it("Modifier plusieurs quizzes correctement. - S", (done) => {
        QuizService.updateManyQuizzes(tab_id_quizzes, { categorie: "Fonds marins" }, null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_quizzes.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_quizzes.length)
            done()

        })
    })
    it("Modifier plusieurs quizzes avec id incorrect. - E", (done) => {
        QuizService.updateManyQuizzes("1200", { categorie: "Fonds marins" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs quizzes avec des champs requis vide. - E", (done) => {
        QuizService.updateManyQuizzes(tab_id_quizzes, { name: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("deleteOneQuiz", () => {
    it("Supprimer un quiz correct. - S", (done) => {
        QuizService.deleteOneQuiz(id_quiz_valid, null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Supprimer un quiz avec id incorrect. - E", (done) => {
        QuizService.deleteOneQuiz("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un quiz avec un id inexistant. - E", (done) => {
        QuizService.deleteOneQuiz("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyQuizzes", () => {
    it("Supprimer plusieurs quizzes correctement. - S", (done) => {
        QuizService.deleteManyQuizzes(tab_id_quizzes, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_quizzes.length)
            done()

        })
    })
    it("Supprimer plusieurs quizzes avec id incorrect. - E", (done) => {
        QuizService.deleteManyQuizzes("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
});

it("Suppression des catégories fictives", (done) => {
    CategorieService.deleteManyCategories(tab_id_categories, null, function (err, value) {
        done()
    })
})

it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
        done()
    })
})