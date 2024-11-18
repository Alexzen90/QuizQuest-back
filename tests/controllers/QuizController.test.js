const UserService = require('../../services/UserService')
const CategorieService = require('../../services/CategorieService')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
const _ = require('lodash')
let should = chai.should();
var tab_id_users = []
var tab_id_categories = []
var quizzes = []
let token

let users = [
  {
      name: "Détenteur de quiz 1",
      username: "oui1",
      email:"iencli1@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de quiz 2",
      username: "oui2",
      email:"iencli2@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de quiz 3",
      username: "oui3",
      email:"iencli3@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de quiz 4",
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
    categories = _.map(categories, (e) => {
        e.user_id = rdm_item(tab_id_users)
        return e
    })
  CategorieService.addManyCategories(categories, null, function (err, value) {
      tab_id_categories = _.map(value, '_id')
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


describe("POST - /quiz", () => {
    it("Ajouter un quiz. - S", (done) => {
        chai.request(server)
        .post('/quiz')
        .auth(token, { type: 'bearer' })
        .send({
          user_id: rdm_item(tab_id_users),
          categorie_id: rdm_item(tab_id_categories),
          name: "Quiz sur Naruto",
        })
        .end((err, res) => {
            console.log(res.body)
            expect(res).to.have.status(201)
            quizzes.push(res.body)
            done()
        });
    })
    it("Ajouter un quiz incorrect. (Sans name) - E", (done) => {
        chai.request(server).post('/quiz').send({
          user_id: rdm_item(tab_id_users),
          categorie_id: rdm_item(tab_id_categories)
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un quiz incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/quiz').send({
          user_id: rdm_item(tab_id_users),
          categorie_id: rdm_item(tab_id_categories),
          name: ""
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("POST - /quizzes", () => {
    it("Ajouter des quizzes. - S", (done) => {
        chai.request(server).post('/quizzes').auth(token, { type: 'bearer' }).send([
          {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "test1"
          }, {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "test2"
          },
          {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "test3"
          }
        ]).end((err, res) => {
            expect(res).to.have.status(201)
            quizzes = [...quizzes, ...res.body]
            done()
        });
    })
    it("Ajouter des quizzes incorrects (sans name). - E", (done) => {
        chai.request(server).post('/quizzes').auth(token, { type: 'bearer' }).send([
          {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "test1"
          }, {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories)
          },
          {
            user_id: rdm_item(tab_id_users),
            name: "test3"
          }
        ]).end((err, res) => {
            expect(res).to.have.status(405)   
            done()
        });
    })
    it("Ajouter des quizzes sans etre authentifié. - E", (done) => {
        chai.request(server).post('/quizzes').send([
          {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "test1"
          }, {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "test2"
          },
          {
            user_id: rdm_item(tab_id_users),
            categorie_id: rdm_item(tab_id_categories),
            name: "test3"
          }
        ]).end((err, res) => {
            expect(res).to.have.status(401)
            done()
        });
    })
})

describe("GET - /quiz/:id", () => {
    it("Chercher un quiz correct. - S", (done) => {
        chai.request(server).get('/quiz/' + quizzes[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Chercher un quiz sans etre authentifié. - E", (done) => {
        chai.request(server).get('/quiz/' + quizzes[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher un quiz incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/quiz/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher un quiz incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).get('/quiz/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    
})

describe("GET - /quizzes", () => {
    it("Chercher plusieurs quizzes. - S", (done) => {
        chai.request(server)
        .get('/quizzes')
        .query({id: _.map(quizzes, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body).to.be.an('array')
            done()
        })
    })
    it("Chercher plusieurs quizzes sans etre authentifié. - E", (done) => {
        chai.request(server).get('/quizzes').query({id: _.map(quizzes, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher plusieurs quizzes incorrectes (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/quizzes').query({id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"]})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs quizzes incorrectes (avec un id invalide). - E", (done) => {
        chai.request(server).get('/quizzes').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /quiz", () => {
    it("Modifier un quiz. - S", (done) => {
        chai.request(server).put('/quiz/' + quizzes[0]._id).send({ name: "La faune et la flore" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Modifier un quiz sans etre authentifié. - E", (done) => {
        chai.request(server).put('/quiz/' + quizzes[0]._id).send({ name: "Les objets suspects" })
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Modifier un quiz avec un id invalide. - E", (done) => {
        chai.request(server).put('/quiz/123456789').send({ name: "La plage" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un quiz avec un id inexistant. - E", (done) => {
        chai.request(server).put('/quiz/66791a552b38d88d8c6e9ee7').send({ name: "Monts et merveilles"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier un quiz avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/quiz/' + quizzes[0]._id).send({name: ""})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /quizzes", () => {
  it("Modifier plusieurs quizzes. - S", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ categorie_id: rdm_item(categories)._id })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(200)
          done()
      })
  })
  it("Modifier plusieurs quizzes sans etre authentifié. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ categorie_id: rdm_item(categories)._id })
      .end((err, res) => {
          res.should.have.status(401)
          done()
      })
  })
  it("Modifier plusieurs quizzes avec des ids invalide. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: ['267428142', '41452828']}).send({ category_id: rdm_item(categories)._id })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })

  it("Modifier plusieurs quizzes avec des ids inexistants. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: ['66791a552b38d88d8c6e9ee7', '667980886db560087464d3a7']})
      .auth(token, { type: 'bearer' })
      .send({ name: "Les voitures12" })
      .end((err, res) => {
          res.should.have.status(404)
          done()
      })
  })

  it("Modifier des quizzes avec un champ requis vide. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ name: ""})
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })

  it("Modifier des quizzes avec un champ unique existant. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ name: quizzes[1].name })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })
})

describe("DELETE - /quiz", () => {
    it("Supprimer une quiz. - S", (done) => {
        chai.request(server).delete('/quiz/' + quizzes[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer une quiz sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/quiz/' + quizzes[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer une quiz incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/quiz/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer une quiz incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/quiz/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /quizzes", () => {
    it("Supprimer plusieurs quizzes. - S", (done) => {
        chai.request(server).delete('/quizzes').query({id: _.map(quizzes, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer plusieurs quizzes sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/quizzes').query({id: _.map(quizzes, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer plusieurs quizzes incorrectes (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/quizzes/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs quizzes incorrectes (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/quizzes').query({id: ['123', '456']})
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

describe("DELETE - /users", () => {
    it("Suppression des utilisateurs fictif", (done) => {
        UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
            done()
        })
    })  
})
