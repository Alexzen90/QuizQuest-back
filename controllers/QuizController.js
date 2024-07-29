const QuizService = require('../services/QuizService')
const LoggerHttp = require ('../utils/logger').http

// La fonction permet d'ajouter une quiz
module.exports.addOneQuiz = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'une quiz")
    let options = {user: req.user}

    QuizService.addOneQuiz(req.body, options, function(err, value) {
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

// La fonction permet d'ajouter plusieurs quizzes
module.exports.addManyQuizzes = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création de plusieurs quizzes")
    let options = {user: req.user}
    
    QuizService.addManyQuizzes(req.body, options, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet de chercher un quiz
module.exports.findOneQuizById = function(req, res) {
    req.log.info("Recherche d'un quiz par son id")
    let opts = {populate: req.query.populate}

    QuizService.findOneQuizById(req.params.id, opts, function(err, value) {        
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

// La fonction permet de chercher plusieurs quizzes
module.exports.findManyQuizzesById = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs quizzes", req.query.id)
    let arg = req.query.id
    let opts = {populate: req.query.populate}
    if (arg && !Array.isArray(arg))
        arg=[arg]

    QuizService.findManyQuizzesById(arg, opts, function(err, value) {
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

// La fonction permet de modifier un quiz
module.exports.updateOneQuiz = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un quiz")
    let update = req.body
    let options = {user: req.user}
    QuizService.updateOneQuiz(req.params.id, update, options, function(err, value) {
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

// La fonction permet de modifier plusieurs quizzes
module.exports.updateManyQuizzes = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs quizzes")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    let options = {user: req.user}
    QuizService.updateManyQuizzes(arg, updateData, options, function(err, value) {
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

module.exports.deleteOneQuiz = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un quiz")
    QuizService.deleteOneQuiz(req.params.id, null, function(err, value) {        
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

// La fonction permet de supprimer plusieurs quizzes
module.exports.deleteManyQuizzes = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs quizzes")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    QuizService.deleteManyQuizzes(arg, null, function(err, value) {
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