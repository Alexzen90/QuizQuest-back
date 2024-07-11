const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const server = require('./../../server')
const should = chai.should()
const _ = require('lodash')
var users = []
chai.use(chaiHttp)

describe("POST - /user", () => {
    it("Ajouter un utilisateur. - S", (done) => {
        chai.request(server).post('/user').send({
            username: "luf", 
            name: "Us",
            email: "lutfu.us@gmail.com",
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(201)
            users.push(res.body)
            done()
        });
    })
    it("Ajouter un utilisateur incorrect. (Sans username) - E", (done) => {
        chai.request(server).post('/user').send({
            name: 'Us',
            email: 'lutfu.us@gmil.com',
            password: '123456'
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un username existant) - E", (done) => {
        chai.request(server).post('/user').send({
            name: "Us",
            username: "luf",
            email: "lutfu.us@gmai.com",
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/user').send({
            username: "luffuuuu",
            name: "dwarfSlaye",
            email: "",
            password: "123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})