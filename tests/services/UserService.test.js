const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_user_valid = ""
var tab_id_users = []
var users = []

describe("addOneUser", () => {
    it("Utilisateur correct. - S", () => {
        var user = {
            username: "Edouard",
            name: "Dupont",
            email: "edouard.dupont1@gmail.com",
            password: "edupontzeaz"
        }
        UserService.addOneUser(user, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            id_user_valid = value._id
            users.push(value)
        })
    })
    it("Utilisateur incorrect. (Sans firstName) - E", () => {
        var user_no_valid = {
            lastName: "Dupont",
            email: "edouard.dupont2@gmail.com",
            username: "edupont888"
        }
        UserService.addOneUser(user_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')

        })
    })
})