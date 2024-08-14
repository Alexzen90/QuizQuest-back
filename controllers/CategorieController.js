const CategorieService = require('../services/CategorieService')
const LoggerHttp = require ('../utils/logger').http

// La fonction permet d'ajouter une categorie
module.exports.addOneCategorie = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'une categorie")
    let options = {user: req.user}

    CategorieService.addOneCategorie(req.body, options, function(err, value) {
        if (err && err.type_error == "no found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "duplicate") {
            res.statusCode = 405
            res.send(err)   
        }
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet d'ajouter plusieurs categories
module.exports.addManyCategories = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création de plusieurs categories")
    let options = {user: req.user}
    
    CategorieService.addManyCategories(req.body, options, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet de chercher un categorie
module.exports.findOneCategorieById = function(req, res) {
    req.log.info("Recherche d'une categorie par son id")
    let opts = {populate: req.query.populate}

    CategorieService.findOneCategorieById(req.params.id, opts, function(err, value) {        
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de chercher plusieurs categories
module.exports.findManyCategoriesById = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs categories", req.query.id)
    let arg = req.query.id
    let opts = {populate: req.query.populate}
    if (arg && !Array.isArray(arg))
        arg=[arg]

    CategorieService.findManyCategoriesById(arg, opts, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de chercher un utilisateur par les champs autorisé
module.exports.findOneCategorie = function(req, res){
    LoggerHttp(req, res)
    req.log.info("Recherche d'une categorie par un champ autorisé")
    let fields = req.query.fields
    let opts = {populate: req.query.populate}
    if (fields && !Array.isArray(fields))
        fields = [fields]

    CategorieService.findOneCategorie(fields, req.query.value, opts, function(err, value) {        
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de chercher plusieurs catégories
module.exports.findManyCategories = function(req, res) {
    req.log.info("Recherche de plusieurs categories")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    let opts = {populate: req.query.populate}

    CategorieService.findManyCategories(searchValue, pageSize, page,  opts, function(err, value) {        
        if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de modifier une categorie
module.exports.updateOneCategorie = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'une categorie")
    let update = req.body
    let options = {user: req.user}
    CategorieService.updateOneCategorie(req.params.id, update, options, function(err, value) {
        //
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == "duplicate" ) ) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de modifier plusieurs categories
// module.exports.updateManyCategories = function(req, res) {
//     LoggerHttp(req, res)
//     req.log.info("Modification de plusieurs categories")
//     var arg = req.query.id
//     if (arg && !Array.isArray(arg))
//         arg = [arg]
//     var updateData = req.body
//     let options = {user: req.user}
//     CategorieService.updateManyCategories(arg, updateData, options, function(err, value) {
//         if (err && err.type_error == "no-found") {
//             res.statusCode = 404
//             res.send(err)
//         }
//         else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == 'duplicate')) {
//             res.statusCode = 405
//             res.send(err)
//         }
//         else if (err && err.type_error == "error-mongo") {
//             res.statusCode = 500
//         }
//         else {
//             res.statusCode = 200
//             res.send(value)
//         }
//     })
// }

module.exports.deleteOneCategorie = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un categorie")
    CategorieService.deleteOneCategorie(req.params.id, null, function(err, value) {        
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de supprimer plusieurs categories
module.exports.deleteManyCategories = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs categories")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    CategorieService.deleteManyCategories(arg, null, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}