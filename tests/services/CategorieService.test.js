const CategorieService = require('../../services/CategorieService')
const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_categorie_valid = ""
var tab_id_categories = []
var tab_id_users = []
var categories = []

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

function rdm_user (tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

describe("addOneCategorie", () => {
    it("Categorie correct. - S", (done) => {
        var categorie = {
            user_id: rdm_user(tab_id_users),
            name: "test"
        }
        CategorieService.addOneCategorie(categorie, null, function(err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_categorie_valid = value._id
            categories.push(value)
            done()
        })
    })
    it("Categorie incorrect. (Sans name) - E", (done) => {
        var categorie_no_valid = {
            user_id: rdm_user(tab_id_users)
        }
        CategorieService.addOneCategorie(categorie_no_valid,  null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            console.log("LAAAAAAAAAAAAAAAAAAAAAAAAAAAA", err)
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
    it("Categorie incorrect. (name vide) - E", (done) => {
        var categorie_no_valid = {
            user_id: rdm_user(tab_id_users),
            name: ""
        }
        CategorieService.addOneCategorie(categorie_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("addManyCategories", () => {
    it("Categories à ajouter, valide. - S", (done) => {
        var categories_tab = [{
            user_id: rdm_user(tab_id_users),
            name: "cinema"
        }, {
            user_id: rdm_user(tab_id_users),
            name: "voiture",
        },
        {
            user_id: rdm_user(tab_id_users),
            name: "jeuxvideo",
        }]

        CategorieService.addManyCategories(categories_tab, null, function (err, value) {
            tab_id_categories = _.map(value, '_id')
            categories = [...value, ...categories]
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Categories à ajouter, non valide. (Name vide) - E", (done) => {
        var categories_tab_error = [{
            user_id: rdm_user(tab_id_users),
            name: "fourchette",
        }, {
            user_id: rdm_user(tab_id_users),
            name: "couteau",
        },
        {
            user_id: rdm_user(tab_id_users),
            name: "",
        }]

        CategorieService.addManyCategories(categories_tab_error, null, function (err, value) {
            expect(err[0]).to.haveOwnProperty('msg')
            expect(err[0]).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err[0]).to.haveOwnProperty('fields')
            expect(err[0]).to.haveOwnProperty('index')
            expect(err[0]['fields']).to.haveOwnProperty('name')
            expect(err[0]['fields']['name']).to.equal('Path `name` is required.')
            expect(err[0]['index']).to.equal(2)
            done()
        })
    })
})

describe("findOneCategorieById", () => {
    it("Chercher un categorie existant avec un id correct. - S", (done) => {
        CategorieService.findOneCategorieById(id_categorie_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher un categorie inexistant avec un id correct. - E", (done) => {
        CategorieService.findOneCategorieById("6694e40466b1fde90ef8f1f9", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-found')
            done()
        })
    })
    it("Chercher un categorie avec un id invalide. - E", (done) => {
        CategorieService.findOneCategorieById("6694", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyCategoriesById", () => {
    it("Chercher des categories existant correct. - S", (done) => {
        CategorieService.findManyCategoriesById(tab_id_categories, null, function (err, value) {
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Chercher des categories inexistant ou incorrect. - E", (done) => {
        CategorieService.findManyCategoriesById(['110155', '6694e3d6bc85790ed4801278', '61'], null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('fields')
            expect(err['type_error']).to.equal('no-valid')
            expect(err['fields']).to.have.lengthOf(2)
            done()
        })
    })
})

describe("findOneCategorie", () => {
    it("Chercher un categorie par les champs selectionnées. - S", (done) => {
        CategorieService.findOneCategorie(["name"], categories[0].name, null, function (err, value) {
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher un categorie sans tableau de champ. - E", (done) => {
        CategorieService.findOneCategorie("name", categories[0].name, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un categorie inexistant. - E", (done) => {
        CategorieService.findOneCategorie(["name"], "categories[0].name", null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findManyCategories", () => {
    it("Retourne 3 categories - S", (done) => {
        CategorieService.findManyCategories(null, 3, 1, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(4)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("Faire une recherche avec 0 résultats correspondant - S", (done) => {
        CategorieService.findManyCategories('fruit', 1, 3, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["results"]).lengthOf(0)
            expect(err).to.be.null
            done()
        })
    })
    it("Envoie d'une chaine de caractère a la place de la page - E", (done) => {
        CategorieService.findManyCategories(null, "coucou", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("updateOneCategorie", () => {
    it("Modifier une categorie correct. - S", (done) => {
        CategorieService.updateOneCategorie(id_categorie_valid, { name: "Moto" }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('updated_at')
            expect(value['name']).to.be.equal('Moto')
            done()

        })
    })
    it("Modifier un categorie avec id incorrect. - E", (done) => {
        CategorieService.updateOneCategorie("1200", { name: "Jean", price: 60 }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un categorie avec des champs requis vide. - E", (done) => {
        CategorieService.updateOneCategorie(id_categorie_valid, { name: "" }, null, function (err, value) {
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

// describe("updateManyCategories", () => {
//     it("Modifier plusieurs categories correctement. - S", (done) => {
//         CategorieService.updateManyCategories(tab_id_categories, { name: "bateau" }, null, function (err, value) {
//             expect(value).to.haveOwnProperty('modifiedCount')
//             expect(value).to.haveOwnProperty('matchedCount')
//             expect(value['matchedCount']).to.be.equal(tab_id_categories.length)
//             expect(value['modifiedCount']).to.be.equal(tab_id_categories.length)
//             done()

//         })
//     })
//     it("Modifier plusieurs categories avec id incorrect. - E", (done) => {
//         CategorieService.updateManyCategories("1200", { name: "trotinette" }, null, function (err, value) {
//             expect(err).to.be.a('object')
//             expect(err).to.haveOwnProperty('msg')
//             expect(err).to.haveOwnProperty('type_error')
//             expect(err['type_error']).to.be.equal('no-valid')
//             done()
//         })
//     })
//     it("Modifier plusieurs categories avec des champs requis vide. - E", (done) => {
//         CategorieService.updateManyCategories(tab_id_categories, { name: "" }, null, function (err, value) {
//             expect(value).to.be.undefined
//             expect(err).to.haveOwnProperty('msg')
//             expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
//             expect(err).to.haveOwnProperty('fields')
//             expect(err['fields']).to.haveOwnProperty('name')
//             expect(err['fields']['name']).to.equal('Path `name` is required.')
//             done()
//         })
//     })
// })

describe("deleteOneCategorie", () => {
    it("Supprimer un categorie correct. - S", (done) => {
        CategorieService.deleteOneCategorie(id_categorie_valid, null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Supprimer un categorie avec id incorrect. - E", (done) => {
        CategorieService.deleteOneCategorie("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un categorie avec un id inexistant. - E", (done) => {
        CategorieService.deleteOneCategorie("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyCategories", () => {
    it("Supprimer plusieurs categories correctement. - S", (done) => {
        CategorieService.deleteManyCategories(tab_id_categories, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_categories.length)
            done()

        })
    })
    it("Supprimer plusieurs categories avec id incorrect. - E", (done) => {
        CategorieService.deleteManyCategories("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
});

it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
        done()
    })
})