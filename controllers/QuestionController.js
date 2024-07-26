const QuestionService = require('../services/QuestionService')
const LoggerHttp = require ('../utils/logger').http

// La fonction permet d'ajouter une question
module.exports.addOneQuestion = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'une question")
    let options = {user: req.user}

    QuestionService.addOneQuestion(req.body, options, function(err, value) {
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

// La fonction permet d'ajouter plusieurs questions
module.exports.addManyQuestions = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création de plusieurs questions")
    let options = {user: req.user}
    
    QuestionService.addManyQuestions(req.body, options, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet de chercher un question
module.exports.findOneQuestionById = function(req, res) {
    req.log.info("Recherche d'une question par son id")
    let opts = {populate: req.query.populate}

    QuestionService.findOneQuestionById(req.params.id, opts, function(err, value) {        
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

// La fonction permet de chercher plusieurs questions
module.exports.findManyQuestionsById = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs questions", req.query.id)
    let arg = req.query.id
    let opts = {populate: req.query.populate}
    if (arg && !Array.isArray(arg))
        arg=[arg]

    QuestionService.findManyQuestionsById(arg, opts, function(err, value) {
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

// La fonction permet de modifier une question
module.exports.updateOneQuestion = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un question")
    let update = req.body
    let options = {user: req.user}
    QuestionService.updateOneQuestion(req.params.id, update, options, function(err, value) {
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

// La fonction permet de modifier plusieurs questions
module.exports.updateManyQuestions = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs questions")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    let options = {user: req.user}
    QuestionService.updateManyQuestions(arg, updateData, options, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == 'duplicate')) {
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

module.exports.deleteOneQuestion = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un question")
    QuestionService.deleteOneQuestion(req.params.id, null, function(err, value) {        
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

// La fonction permet de supprimer plusieurs questions
module.exports.deleteManyQuestions = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs questions")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    QuestionService.deleteManyQuestions(arg, null, function(err, value) {
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