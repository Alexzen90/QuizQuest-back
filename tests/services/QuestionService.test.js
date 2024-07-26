const QuestionService = require('../../services/QuestionService')
const UserService = require('../../services/UserService')
const CategorieService = require('../../services/CategorieService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_question_valid = ""
var tab_id_questions = []
var tab_id_users = []
let tab_id_categories = []
var questions = []

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

it("Création des catégories fictives", (done) => {
  CategorieService.addManyCategories(categories, null, function (err, value) {
      tab_id_categories = _.map(value, '_id')
      done()
  })
})

it("Authentification d'un utilisateur fictif.", (done) => {
    UserService.loginUser('oui4', "1234", null, function(err, value) {
        valid_token = value.token
        done()
    })
})

function rdm_categorie (tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

describe("addOneQuestion", () => {
    it("Question correct. - S", (done) => {
        var question = {
            categorie_id: rdm_categorie(tab_id_categories),
            question: "Quel animal est Sonic ?",
            difficulty: "Facile",
            correct_answer: "Un hérisson",
            incorrect_answers: ["Un dragon", "Un lapin", "Un chien"]
        }
        QuestionService.addOneQuestion(question, null, function(err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('categorie_id')
            id_question_valid = value._id
            questions.push(value)
            done()
        })
    })
    it("Question incorrect. (Sans question) - E", (done) => {
        var question_no_valid = {
          categorie_id: rdm_categorie(tab_id_categories),
          difficulty: "Facile",
          correct_answer: "Un hérisson",
          incorrect_answers: ["Un dragon", "Un lapin", "Un chien"]
        }
        QuestionService.addOneQuestion(question_no_valid,  null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            // expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('question')
            expect(err['fields']['question']).to.equal('Path `question` is required.')
            done()
        })
    })
    it("Question incorrect. (question vide) - E", (done) => {
        var question_no_valid = {
          categorie_id: rdm_categorie(tab_id_categories),
          question: "",
          difficulty: "Facile",
          correct_answer: "Un hérisson",
          incorrect_answers: ["Un dragon", "Un lapin", "Un chien"]
        }
        QuestionService.addOneQuestion(question_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('question')
            expect(err['fields']['question']).to.equal('Path `question` is required.')
            done()
        })
    })
})

describe("addManyQuestions", () => {
    it("Questions à ajouter, valide. - S", (done) => {
        var questions_tab = [{
          categorie_id: rdm_categorie(tab_id_categories),
          question: "Qui est le réalisateur du film d'animation 'Your Name' ?",
          difficulty: "Moyen",
          correct_answer: "Makoto Shinkai",
          incorrect_answers: ["Hayao Miyazaki", "Mamoru Hosoda", "Satoshi Kon"]
        }, {
          categorie_id: rdm_categorie(tab_id_categories),
          question: "Dans l'Attaque des Titans quel est le nom du district où vivaient Eren, Mikasa et Armin avant l'attaque du Titan Colossal ?",
          difficulty: "Difficile",
          correct_answer: "District de Shinganshina",
          incorrect_answers: ["District de Trost", "District de Karanes", "District de Stohess"]
        },
        {
          categorie_id: rdm_categorie(tab_id_categories),
          question: "Dans One Piece, quel est le nom du fruit du démon que mange le personnage principal Luffy ?",
          difficulty: "Facile",
          correct_answer: "Gomu Gomu no Mi",
          incorrect_answers: ["Mera Mera no Mi", "Bara Bara no Mi", "Gura Gura no Mi"]
        }]

        QuestionService.addManyQuestions(questions_tab, null, function (err, value) {
            tab_id_questions = _.map(value, '_id')
            questions = [...value, ...questions]
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Questions à ajouter, non valide. (Question vide) - E", (done) => {
        var questions_tab_error = [{
          categorie_id: rdm_categorie(tab_id_categories),
          question: "",
          difficulty: "Facile",
          correct_answer: "Gomu Gomu no Mi",
          incorrect_answers: ["Mera Mera no Mi", "Bara Bara no Mi", "Gura Gura no Mi"]
        }, {
          categorie_id: rdm_categorie(tab_id_categories),
          question: "ahahaha",
          difficulty: "Facile",
          correct_answer: "Gomu Gomu no Mi",
          incorrect_answers: ["Mera Mera no Mi", "Bara Bara no Mi", "Gura Gura no Mi"]
        },
        {
          categorie_id: rdm_categorie(tab_id_categories),
          question: "salut",
          difficulty: "Facile",
          correct_answer: "Gomu Gomu no Mi",
          incorrect_answers: ["Mera Mera no Mi", "Bara Bara no Mi", "Gura Gura no Mi"]
        }]

        QuestionService.addManyQuestions(questions_tab_error, null, function (err, value) {
            expect(err[0]).to.haveOwnProperty('msg')
            expect(err[0]).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err[0]).to.haveOwnProperty('fields')
            expect(err[0]).to.haveOwnProperty('index')
            expect(err[0]['fields']).to.haveOwnProperty('question')
            expect(err[0]['fields']['question']).to.equal('Path `question` is required.')
            expect(err[0]['index']).to.equal(0)
            done()
        })
    })
})

describe("findOneQuestionById", () => {
    it("Chercher un question existant avec un id correct. - S", (done) => {
        QuestionService.findOneQuestionById(id_question_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('correct_answer')
            done()
        })
    })
    it("Chercher un question inexistant avec un id correct. - E", (done) => {
        QuestionService.findOneQuestionById("6694e40466b1fde90ef8f1f9", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-found')
            done()
        })
    })
    it("Chercher un question avec un id invalide. - E", (done) => {
        QuestionService.findOneQuestionById("6694", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyQuestionsById", () => {
    it("Chercher des questions existantes. - S", (done) => {
        QuestionService.findManyQuestionsById(tab_id_questions, null, function (err, value) {
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Chercher des questions inexistant ou incorrect. - E", (done) => {
        QuestionService.findManyQuestionsById(['110155', '6694e3d6bc85790ed4801278', '61'], null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('fields')
            expect(err['type_error']).to.equal('no-valid')
            expect(err['fields']).to.have.lengthOf(2)
            done()
        })
    })
})

describe("updateOneQuestion", () => {
    it("Modifier une question correct. - S", (done) => {
        QuestionService.updateOneQuestion(id_question_valid, { correct_answer: "Une vache" }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('correct_answer')
            expect(value).to.haveOwnProperty('updated_at')
            expect(value['correct_answer']).to.be.equal('Une vache')
            done()

        })
    })
    it("Modifier un question avec id incorrect. - E", (done) => {
        QuestionService.updateOneQuestion("1200", { question: "Qui est la plus belle ?", difficulty: "Difficile" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un question avec des champs requis vide. - E", (done) => {
        QuestionService.updateOneQuestion(id_question_valid, { question: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('question')
            expect(err['fields']['question']).to.equal('Path `question` is required.')
            done()
        })
    })
})

describe("updateManyQuestions", () => {
    it("Modifier plusieurs questions correctement. - S", (done) => {
        QuestionService.updateManyQuestions(tab_id_questions, { difficulty: "Moyen" }, null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_questions.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_questions.length)
            done()

        })
    })
    it("Modifier plusieurs questions avec id incorrect. - E", (done) => {
        QuestionService.updateManyQuestions("1200", { difficulty: "Facile" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs questions avec des champs requis vide. - E", (done) => {
        QuestionService.updateManyQuestions(tab_id_questions, { question: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('question')
            expect(err['fields']['question']).to.equal('Path `question` is required.')
            done()
        })
    })
})

describe("deleteOneQuestion", () => {
    it("Supprimer un question correct. - S", (done) => {
        QuestionService.deleteOneQuestion(id_question_valid, null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('question')
            done()
        })
    })
    it("Supprimer un question avec id incorrect. - E", (done) => {
        QuestionService.deleteOneQuestion("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un question avec un id inexistant. - E", (done) => {
        QuestionService.deleteOneQuestion("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyQuestions", () => {
    it("Supprimer plusieurs questions correctement. - S", (done) => {
        QuestionService.deleteManyQuestions(tab_id_questions, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_questions.length)
            done()

        })
    })
    it("Supprimer plusieurs questions avec id incorrect. - E", (done) => {
        QuestionService.deleteManyQuestions("1200", null, function (err, value) {
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