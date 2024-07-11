const UserService = require('../services/UserService')

// La fonction permet d'ajouter un utilisateur.
module.exports.addOneUser = function(req, res) {
  req.log.info("Création d'un utilisateur")
  UserService.addOneUser(req.body, function(err, value) {
    if (err && err.type_error == "no-found") {
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
    }else {
      res.statusCode = 201
      res.send(value)
    }
  })
}