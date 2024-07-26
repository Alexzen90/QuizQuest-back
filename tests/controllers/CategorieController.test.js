const UserService = require('../../services/UserService')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
const _ = require('lodash')
let should = chai.should();
var tab_id_users = []
var categories = []
let token

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

describe("POST - /users", () => {
    it("Création des utilisateurs fictif", (done) => {
        UserService.addManyUsers(users, null, function (err, value) {
            tab_id_users = _.map(value, '_id')
            done()
        })
    })
})

describe("POST - /login", () => {
    it("Authentification d'un utilisateur fictif.", (done) => {
        UserService.loginUser('oui4', "1234", null, function(err, value) {
            token = value.token
            done()
        })
    })
})

function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

chai.use(chaiHttp)


describe("POST - /categorie", () => {
    it("Ajouter une categorie. - S", (done) => {
        chai.request(server).post('/categorie').auth(token, { type: 'bearer' }).send({
            user_id: rdm_user(tab_id_users),
            name: "voiture",
        }).end((err, res) => {
            expect(res).to.have.status(201)
            categories.push(res.body)
            done()
        });
    })
    it("Ajouter une categorie incorrect. (Sans name) - E", (done) => {
        chai.request(server).post('/categorie').send({
            user_id: rdm_user(tab_id_users),
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter une categorie incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/categorie').send({
            user_id: rdm_user(tab_id_users),
            name: "",
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("POST - /categories", () => {
    it("Ajouter des categories. - S", (done) => {
        chai.request(server).post('/categories').auth(token, { type: 'bearer' }).send([
            {
                user_id: rdm_user(tab_id_users),
                name: "voitureaufromage"
            },
            {
                user_id: rdm_user(tab_id_users),
                name: "piscine"
            },
            {
                user_id: rdm_user(tab_id_users),
                name: "helicopter"
            },
        ]).end((err, res) => {
            expect(res).to.have.status(201)
            categories = [...categories, ...res.body]
            done()
        });
    })
    it("Ajouter des categories incorrecte. - E", (done) => {
        chai.request(server).post('/categories').auth(token, { type: 'bearer' }).send([
            {
                user_id: rdm_user(tab_id_users),
            },
            {
                user_id: rdm_user(tab_id_users),
                name: "velociraptor",
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)   
            done()
        });
    })
    it("Ajouter des categories sans etre authentifié. - E", (done) => {
        chai.request(server).post('/categories').send([
            {
                user_id: rdm_user(tab_id_users),
                name: "voitureagaz",
            },
            {
                user_id: rdm_user(tab_id_users),
                name: "veloaroulette",
            },
            {
                user_id: rdm_user(tab_id_users),
                name: "avion",
            },
        ]).end((err, res) => {
            expect(res).to.have.status(401)
            done()
        });
    })
})

describe("GET - /categorie/:id", () => {
    it("Chercher un categorie correct. - S", (done) => {
        chai.request(server).get('/categorie/' + categories[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Chercher un categorie sans etre authentifié. - E", (done) => {
        chai.request(server).get('/categorie/' + categories[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher un categorie incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/categorie/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher un categorie incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).get('/categorie/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    
})

describe("GET - /categories", () => {
    it("Chercher plusieurs categories. - S", (done) => {
        chai.request(server).get('/categories').query({id: _.map(categories, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body).to.be.an('array')
            done()
        })
    })
    it("Chercher plusieurs categories sans etre authentifié. - E", (done) => {
        chai.request(server).get('/categories').query({id: _.map(categories, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher plusieurs categories incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/categories').query({id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"]})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs categories incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).get('/categories').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /categorie", () => {
    it("Modifier une categorie. - S", (done) => {
        chai.request(server).put('/categorie/' + categories[0]._id).send({ name: "Tv" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Modifier une categorie sans etre authentifié. - E", (done) => {
        chai.request(server).put('/categorie/' + categories[0]._id).send({ name: "Tv" })
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Modifier une categorie avec un id invalide. - E", (done) => {
        chai.request(server).put('/categorie/123456789').send({name: "pommier"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier une categorie avec un id inexistant. - E", (done) => {
        chai.request(server).put('/categorie/66791a552b38d88d8c6e9ee7').send({name: "pommier"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier une categorie avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/categorie/' + categories[0]._id).send({name: ""})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /categorie", () => {
    it("Supprimer un categorie. - S", (done) => {
        chai.request(server).delete('/categorie/' + categories[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer un categorie sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/categorie/' + categories[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer un categorie incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/categorie/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer un categorie incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/categorie/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /categories", () => {
    it("Supprimer plusieurs categories. - S", (done) => {
        chai.request(server).delete('/categories').query({id: _.map(categories, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer plusieurs categories sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/categories').query({id: _.map(categories, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer plusieurs categories incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/categories/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs categories incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/categories').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
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
