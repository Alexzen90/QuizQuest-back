const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')

var users = []
let token

chai.use(chaiHttp)

describe("POST - /user", () => {
    it("Ajouter un utilisateur. - S", (done) => {
        chai.request(server).post('/user').send({
            username: "John",
            email: "john1@gmail.com",
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(201)
            users.push(res.body)
            done()
        });
    })
    it("Ajouter un utilisateur incorrect. (Sans username) - E", (done) => {
        chai.request(server).post('/user').send({
            email: 'lutfu.us@gmil.com',
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un username existant) - E", (done) => {
        chai.request(server).post('/user').send({
            username: "John",
            email: "lutfu.us@gmai.com",
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/user').send({
            username: "dwarfSlaye",
            email: "",
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("POST - /login", () => {
    it("Login. - S", (done) => {
        chai.request(server).post('/login').send({
            username: "John",
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(200)
            token = res.body.token
            done()
        });
    })
    it("Login incorrect, mauvais mdp. - E", (done) => {
        chai.request(server).post('/login').send({
            username: "John",
            password: "1234567"
        }).end((err, res) => {
            expect(res).to.have.status(401)
            done()
        });
    })
    it("Login incorrect, mauvais username. - E", (done) => {
        chai.request(server).post('/login').send({
            username: "dwarfSlaeez111eyer",
            password: "lesfemmes"
        }).end((err, res) => {
            expect(res).to.have.status(401)
            done()
        });
    })
})

describe("POST - /users", () => {
    it("Ajouter plusieurs utilisateurs. - S", (done) => {
        chai.request(server).post('/users').send([{
            username: "John2",
            email: "john2@gmail.com",
            password: "123456"
        },
        {
            username: "John3",
            email: "john3@gmail.com",
            password: "123456"
        }]
        )
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(201)
            users = [...users, ...res.body]
            done()
        });
    })
    it("Ajouter plusieurs utilisateurs sans etre authentifié. - E", (done) => {
        chai.request(server).post('/users').send([{
            username: "dwathttvrfSlayer",
            email: "lutfgfbu.us@gmail.com",
            password: "123456"
        },
        {
            username: "dwgfbarfSlayer",
            email: "lutgbffu.us@gmail.com",
            password: "123456"
        }]
        ).end((err, res) => {
            res.should.have.status(401)
            done()
        });
    })
})

describe("GET - /user/:id", () => {
    it("Chercher un utilisateur correct. - S", (done) => {
        chai.request(server).get('/user/' + users[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Chercher un utilisateur incorrect, sans etre authentifié. - E", (done) => {
        chai.request(server).get('/user/' + users[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher un utilisateur incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/user/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher un utilisateur incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).get('/user/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("GET - /users", () => {
    it("Chercher plusieurs utilisateurs. - S", (done) => {
        chai.request(server).get('/users').query({id: _.map(users, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body).to.be.an('array')
            done()
        })
    })
    it("Chercher plusieurs utilisateurs sans etre authentifié. - E", (done) => {
        chai.request(server).get('/users').query({id: _.map(users, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/users').query({id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"]})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).get('/users').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("GET - /user", () => {
    it("Chercher un utilisateur par un champ selectionné. - S", (done) => {
        chai.request(server).get('/user').query({fields: ['username'], value: users[0].username})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Chercher un utilisateur par un champ selectionné sans etre authentifié. - E", (done) => {
        chai.request(server).get('/user').query({fields: ['username'], value: users[0].username})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher un utilisateur avec un champ non autorisé. - E", (done) => {
        chai.request(server).get('/user').query({fields: ['name'], value: users[0].name})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur sans tableau de champ. - E", (done) => {
        chai.request(server).get('/user').query({value: users[0].username})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur avec un champ vide. - E", (done) => {
        chai.request(server).get('/user').query({fields: ['username'], value: ''})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur sans aucune querys. - E", (done) => {
        chai.request(server).get('/user')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur inexistant. - E", (done) => {
        chai.request(server).get('/user').query({fields: ['username'], value: 'users[0].name'})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
})

describe("GET - /users_by_filters", () => {
    it("Chercher plusieurs utilisateurs. - S", (done) => {
        chai.request(server).get('/users_by_filters').query({page: 1, pageSize: 2})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body.results).to.be.an('array')
            done()
        })
    })
    it("Chercher plusieurs utilisateurs sans etre authentifié. - E", (done) => {
        chai.request(server).get('/users_by_filters').query({page: 1, pageSize: 2})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher plusieurs utilisateurs avec une query vide - S", (done) => {
        chai.request(server).get('/users_by_filters')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("Chercher plusieurs utilisateurs avec une query contenant une chaine de caractère - S", (done) => {
        chai.request(server).get('/users_by_filters').query({page: 1, pageSize: 2, q: 'jo'})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body.results).to.be.an('array')
            expect(res.body.count).to.be.equal(3)
            done()
        })
    })
    it("Chercher plusieurs utilisateurs avec une chaine de caractères dans page - E", (done) => {
        chai.request(server).get('/users_by_filters').query({page: 'une phrase', pageSize: 2})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /user", () => {
    it("Modifier un utilisateur. - S", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ name: "Olivier" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Modifier un utilisateur sans etre authentifié. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ name: "Olivier" })
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Modifier un utilisateur avec un id invalide. - E", (done) => {
        chai.request(server).put('/user/123456789').send({name: "Olivier", email: "Edouard@gmail.com"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un utilisateur avec un id inexistant. - E", (done) => {
        chai.request(server).put('/user/66791a552b38d88d8c6e9ee7').send({name: "Olivier", email: "Edouard2@gmail.com"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier un utilisateur avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ username: "", name: "Edouard" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un utilisateur avec un champ unique existant. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ username: users[1].username})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /users", () => {
    it("Modifier plusieurs utilisateurs. - S", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ name: "lucas" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Modifier plusieurs utilisateurs sans etre authentifié. - E", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ name: "lucas" })
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Modifier plusieurs utilisateurs avec des ids invalide. - E", (done) => {
        chai.request(server).put('/users').query({id: ['267428142', '41452828']}).send({name: "Olivier"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier plusieurs utilisateurs avec des ids inexistant. - E", (done) => {
        chai.request(server).put('/users').query({id: ['66791a552b38d88d8c6e9ee7', '667980886db560087464d3a7']})
        .auth(token, { type: 'bearer' })
        .send({name: "Olivier"})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier des utilisateurs avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ username: ""})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier des utilisateurs avec un champ unique existant. - E", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ username: users[1].username})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            //
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /user", () => {
    it("Supprimer un utilisateur. - S", (done) => {
        chai.request(server).delete('/user/' + users[1]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            // console.log(users)
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer un utilisateur sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/user/' + users[1]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer un utilisateur incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/user/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer un utilisateur incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/user/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /users", () => {
    it("Supprimer plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/users/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/users').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    it("Supprimer plusieurs utilisateurs sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/users').query({id: _.map(users, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer plusieurs utilisateurs. - S", (done) => {
        chai.request(server).delete('/users').query({id: _.map(users, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
})