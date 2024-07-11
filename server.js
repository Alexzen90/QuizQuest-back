const express = require('express');
const bodyParser = require('body-parser');
const Config = require('./config');
const Logger = require('./utils/logger').pino

const app = express();

//Démarrage de la database
require('./utils/database')

//Déclaration des controllers pour utilisateur
const UserController = require('./controllers/UserController')

//Déclaration des middlewares
const dbMiddleware = require('./middlewares/database')
const LoggerMiddleware = require('./middlewares/logger')
app.use(bodyParser.json(), LoggerMiddleware.addLogger)

/*----------------- Création des routes -----------------*/

//Création du endpoint /user pour l'ajout d'un utilisateur
app.post('/user', dbMiddleware.checkDbConnection, UserController.addOneUser)

//Démarrage de notre serveur sur le port choisi
app.listen(Config.port, () => {
  Logger.info(`Serveur démarré sur le port ${Config.port}`)
})

module.exports = app