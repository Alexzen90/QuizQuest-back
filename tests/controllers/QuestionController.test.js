const UserService = require('../../services/UserService')
const CategorieService = require('../../services/CategorieService')
const QuizService = require('../../services/QuizService')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
const _ = require('lodash')
let should = chai.should();
var tab_id_users = []
var tab_id_categories = []
let tab_id_quizzes = []
var questions = []
let token

let users = [
  {
      name: "Détenteur de question 1",
      username: "oui1",
      email:"iencli1@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de question 2",
      username: "oui2",
      email:"iencli2@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de question 3",
      username: "oui3",
      email:"iencli3@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de question 4",
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

let quizzes = [
    {
        name: "Quiz 1",
    },
    {
        name: "Quiz 2",
    },
    {
        name: "Quiz 3",
    },
    {
        name: "Quiz 4",
    },
]


it("Création des utilisateurs fictif", (done) => {
    UserService.addManyUsers(users, null, function (err, value) {
        tab_id_users = _.map(value, '_id')
        done()
    })
})


it("Création des catégories fictives", (done) => {
    categories = _.map(categories, (e) => {
        e.user_id = rdm_item(tab_id_users)
        console.log(e, "TEST ID CAT")
        return e
    })
  CategorieService.addManyCategories(categories, null, function (err, value) {
      tab_id_categories = _.map(value, '_id')
      console.log(err, "TEST CATEGORIE FICTIVE")
      done()
  })
})

it("Création des quizzes fictifs", (done) => {
    quizzes = _.map(quizzes, (e) => {
        e.user_id = rdm_item(tab_id_users)
        return e
    })
    QuizService.addManyQuizzes(quizzes, null, function (err, value) {
        tab_id_quizzes = _.map(value, '_id')
        console.log(err, "TEST QUIZZES FICTIF")
        done()
    })
})

function rdm_item(tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

describe("POST - /login", () => {
    it("Authentification d'un utilisateur fictif.", (done) => {
        UserService.loginUser('oui4', "1234", null, function(err, value) {
            token = value.token
            done()
        })
    })
})

chai.use(chaiHttp)


describe("POST - /question", () => {
    it("Ajouter une question. - S", (done) => {
        chai.request(server).post('/question').auth(token, { type: 'bearer' }).send({
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            quiz_id: rdm_item(tab_id_quizzes),
            question: "Quel est le nom du personnage principal de la série 'Devil May Cry' ?",
            difficulty: "Facile",
            correct_answer: "Dante",
            incorrect_answers: ["Nero", "Vergil", "Trish"]
        }).end((err, res) => {
            expect(res).to.have.status(201)
            questions.push(res.body)
            done()
        });
    })
    it("Ajouter une question incorrect. (Sans question) - E", (done) => {
        chai.request(server).post('/question').send({
          user_id: rdm_item(tab_id_users),
          categorie_id: rdm_item(tab_id_categories),
          quiz_id: rdm_item(tab_id_quizzes),
          difficulty: "Facile",
          correct_answer: "Dante",
          incorrect_answers: ["Nero", "Vergil", "Trish"]
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter une question incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/question').send({
          user_id: rdm_item(tab_id_users),
          categorie_id: rdm_item(tab_id_categories),
          quiz_id: rdm_item(tab_id_quizzes),
          question: "",
          difficulty: "Facile",
          correct_answer: "Dante",
          incorrect_answers: ["Nero", "Vergil", "Trish"]
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("POST - /questions", () => {
    it("Ajouter des questions. - S", (done) => {
        chai.request(server).post('/questions').auth(token, { type: 'bearer' }).send([
            {
              user_id: rdm_item(tab_id_users),
              categorie_id: rdm_item(tab_id_categories),
              quiz_id: rdm_item(tab_id_quizzes),
              question: "Dans quel jeu vidéo les joueurs peuvent-ils incarner un chasseur de monstres dans un monde fantastique ?",
              difficulty: "Facile",
              correct_answer: "Monster Hunter",
              incorrect_answers: ["World of Warcraft", "Dark Souls", "Trish"]
            },
            {
              user_id: rdm_item(tab_id_users),
              categorie_id: rdm_item(tab_id_categories),
              quiz_id: rdm_item(tab_id_quizzes),
              question: "Qui est le personnage principal des jeux vidéo 'The Legend of Zelda' ?",
              difficulty: "Facile",
              correct_answer: "Link",
              incorrect_answers: ["Ganon", "Epona", "Zelda"]
            },
            {
              user_id: rdm_item(tab_id_users),
              categorie_id: rdm_item(tab_id_categories),
              quiz_id: rdm_item(tab_id_quizzes),
              question: "Quel est le nom de la famille noble régnant sur le Trône de Fer au début des premiers épisodes de la série 'Game of Thrones' ?",
              difficulty: "Facile",
              correct_answer: "Lannister",
              incorrect_answers: ["Stark", "Targaryen", "Baratheon"]
            },
        ]).end((err, res) => {
            expect(res).to.have.status(201)
            questions = [...questions, ...res.body]
            done()
        });
    })
    it("Ajouter des questions incorrecte. - E", (done) => {
        chai.request(server).post('/questions').auth(token, { type: 'bearer' }).send([
            {
                categorie_id: rdm_item(tab_id_categories),
            },
            {
                categorie_id: rdm_item(tab_id_categories),
                question: "Dans quelle série TV des personnages voyagent-ils à travers le temps en utilisant une machine temporelle appelée TARDIS ? ",
                difficulty: "Moyen",
                correct_answer: "Doctor Who",
                incorrect_answers: ["Star Trek", "Stargate SG-1", "The X-Files"]
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)   
            done()
        });
    })
    it("Ajouter des questions sans etre authentifié. - E", (done) => {
        chai.request(server).post('/questions').send([
            {
              user_id: rdm_item(tab_id_users),
              categorie_id: rdm_item(tab_id_categories),
              quiz_id: rdm_item(tab_id_quizzes),
              question: "Quelle actrice incarne Phoebe dans la série TV 'Charmed' ?",
              difficulty: "Moyen",
              correct_answer: "Alyssa Milano",
              incorrect_answers: ["Shannen Doherty", "Holly Marie Combs", "Rose McGowan"]
            },
            {
              user_id: rdm_item(tab_id_users),
              categorie_id: rdm_item(tab_id_categories),
              quiz_id: rdm_item(tab_id_quizzes),
              question: "Quel acteur incarne Lex Luthor dans la série TV Smallville ?",
              difficulty: "Difficile",
              correct_answer: "Michael Rosenbaum",
              incorrect_answers: ["Tom Welling", "Justin Hartley", "John Schneider"]
            },
            {
              user_id: rdm_item(tab_id_users),
              categorie_id: rdm_item(tab_id_categories),
              quiz_id: rdm_item(tab_id_quizzes),
              question: "Dans 'Peaky Blinders', quelle est la ville principale où se déroule l'action de la série ?",
              difficulty: "Difficile",
              correct_answer: "Birmingham",
              incorrect_answers: ["Liverpool", "Londres", "Glasgow"]
            },
        ]).end((err, res) => {
            expect(res).to.have.status(401)
            done()
        });
    })
})

describe("GET - /question/:id", () => {
    it("Chercher une question correct. - S", (done) => {
        chai.request(server).get('/question/' + questions[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Chercher une question sans etre authentifié. - E", (done) => {
        chai.request(server).get('/question/' + questions[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher une question incorrecte (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/question/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher une question incorrecte (avec un id invalide). - E", (done) => {
        chai.request(server).get('/question/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    
})

describe("GET - /questions", () => {
    it("Chercher plusieurs questions. - S", (done) => {
        chai.request(server).get('/questions').query({id: _.map(questions, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body).to.be.an('array')
            done()
        })
    })
    it("Chercher plusieurs questions sans etre authentifié. - E", (done) => {
        chai.request(server).get('/questions').query({id: _.map(questions, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher plusieurs questions incorrectes (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/questions').query({id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"]})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs questions incorrectes (avec un id invalide). - E", (done) => {
        chai.request(server).get('/questions').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /question", () => {
    it("Modifier une question. - S", (done) => {
        chai.request(server).put('/question/' + questions[0]._id).send({ question: "Quel est la couleur du cheval blanc d'Henry IV ?" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Modifier une question sans etre authentifié. - E", (done) => {
        chai.request(server).put('/question/' + questions[0]._id).send({ question: "Quel est la couleur du cheval blanc d'Henry IV ?" })
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Modifier une question avec un id invalide. - E", (done) => {
        chai.request(server).put('/question/123456789').send({question: "Quel est la couleur du cheval blanc d'Henry IV ?"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier une question avec un id inexistant. - E", (done) => {
        chai.request(server).put('/question/66791a552b38d88d8c6e9ee7').send({difficulty: "Difficile"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier une question avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/question/' + questions[0]._id).send({question: ""})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /questions", () => {
  it("Modifier plusieurs questions. - S", (done) => {
      chai.request(server).put('/questions').query({id: _.map(questions, '_id')}).send({ difficulty: "Moyen" })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(200)
          done()
      })
  })
  it("Modifier plusieurs questions sans etre authentifié. - E", (done) => {
      chai.request(server).put('/questions').query({id: _.map(questions, '_id')}).send({ difficulty: "Moyen" })
      .end((err, res) => {
          res.should.have.status(401)
          done()
      })
  })
  it("Modifier plusieurs questions avec des ids invalide. - E", (done) => {
      chai.request(server).put('/questions').query({id: ['267428142', '41452828']}).send({difficulty: "Moyen"})
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })

  it("Modifier plusieurs questions avec des ids inexistant. - E", (done) => {
      chai.request(server).put('/questions').query({id: ['66791a552b38d88d8c6e9ee7', '667980886db560087464d3a7']})
      .auth(token, { type: 'bearer' })
      .send({difficulty: "Moyen"})
      .end((err, res) => {
          res.should.have.status(404)
          done()
      })
  })

  it("Modifier des questions avec un champ requis vide. - E", (done) => {
      chai.request(server).put('/questions').query({id: _.map(questions, '_id')}).send({ question: ""})
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })

  it("Modifier des questions avec un champ unique existant. - E", (done) => {
      chai.request(server).put('/questions').query({id: _.map(questions, '_id')}).send({ question: questions[1].question })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })
})

describe("DELETE - /question", () => {
    it("Supprimer une question. - S", (done) => {
        chai.request(server).delete('/question/' + questions[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer une question sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/question/' + questions[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer une question incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/question/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer une question incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/question/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /questions", () => {
    it("Supprimer plusieurs questions. - S", (done) => {
        chai.request(server).delete('/questions').query({id: _.map(questions, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer plusieurs questions sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/questions').query({id: _.map(questions, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer plusieurs questions incorrectes (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/questions/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs questions incorrectes (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/questions').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /categories", () => {
    it("Suppression des categories fictives", (done) => {
        CategorieService.deleteManyCategories(tab_id_categories, null, function (err, value) {
            done()
        })
    })
})

describe("DELETE - /quizzes", () => {
    it("Suppression des quiz fictif", (done) => {
        QuizService.deleteManyQuizzes(tab_id_quizzes, null, function (err, value) {
            done()
        })
    })
})

describe("DELETE - /users", () => {
    it("Suppression des utilisateurs fictif", (done) => {
        UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
            done()
        })
    })  
})
