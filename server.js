const express = require('express')              
const _ = require("lodash")
const bodyParser = require('body-parser')
const Config = require ('./config')
const Logger = require('./utils/logger').pino

// Création de notre application express.js
const app = express()

// Démarrage de la database
require('./utils/database')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Ajout de module de login
const passport = require('./utils/passport')
var session = require('express-session')

app.use(session({
    secret: Config.secret_cookie,
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Passport init
app.use(passport.initialize())
app.use(passport.session())

const UserController = require('./controllers/UserController')
const CategorieController = require('./controllers/CategorieController')

const DatabaseMiddleware = require('./middlewares/database')
const LoggerMiddleware = require('./middlewares/logger')

app.use(bodyParser.json(), LoggerMiddleware.addLogger)


/*--------------------- Création des routes (User - Utilisateur) ---------------------*/

// Création du endpoint /login pour connecter un utilisateur
app.post('/login', DatabaseMiddleware.checkConnection, UserController.loginUser)

// Création du endpoint /user pour l'ajout d'un utilisateur
app.post('/user', DatabaseMiddleware.checkConnection, UserController.addOneUser)

// Création du endpoint /user pour l'ajout de plusieurs utilisateurs
app.post('/users', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.addManyUsers)

// Création du endpoint /user pour la récupération d'un utilisateur par le champ selectionné
app.get('/user', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.findOneUser)

// Création du endpoint /users_by_filters pour la récupération de plusieurs utilisateurs
app.get('/users_by_filters', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.findManyUsers)

// Création du endpoint /user pour la récupération d'un utilisateur via l'id
app.get('/user/:id', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.findOneUserById)

// Création du endpoint /user pour la récupération de plusieurs utilisateurs via l'idS
app.get('/users', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.findManyUsersById)

// Création du endpoint /user pour la modification d'un utilisateur
app.put('/user/:id', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.updateOneUser)

// Création du endpoint /user pour la modification de plusieurs utilisateurs
app.put('/users', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.updateManyUsers)

// Création du endpoint /user pour la suppression d'un utilisateur
app.delete('/user/:id', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.deleteOneUser)

// Création du endpoint /user pour la suppression de plusieurs utilisateurs
app.delete('/users', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), UserController.deleteManyUsers)

/*--------------------- Création des routes (Categorie - Categorie) ---------------------*/

// Création du endpoint /categorie pour l'ajout d'une categorie
app.post('/categorie', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.addOneCategorie)

// Création du endpoint /categories pour l'ajout de plusieurs categories
app.post('/categories', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.addManyCategories)

// Création du endpoint /categorie pour la récupération d'une categorie via l'id
app.get('/categorie/:id', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.findOneCategorieById)

// Création du endpoint /categories pour la récupération de plusieurs categories via l'idS
app.get('/categories', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.findManyCategoriesById)

// Création du endpoint /categorie pour la récupération d'une categorie par le champ selectionné
app.get('/categorie', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.findOneCategorie)

// Création du endpoint /categories_by_filters pour la récupération de plusieurs categories par champ selectionné
app.get('/categories_by_filters', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.findManyCategories)

// Création du endpoint /categorie pour la modification d'une categorie
app.put('/categorie/:id', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.updateOneCategorie)

// Création du endpoint /categories pour la modification de plusieurs categories
// app.put('/categories', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.updateManyCategories)

// Création du endpoint /categorie pour la suppression d'une categorie
app.delete('/categorie/:id', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.deleteOneCategorie)

// Création du endpoint /categories pour la suppression de plusieurs categories
app.delete('/categories', DatabaseMiddleware.checkConnection, passport.authenticate('jwt', { session: false }), CategorieController.deleteManyCategories)

app.listen(Config.port, () => {
  Logger.info(`Serveur démarré sur le port ${Config.port}`)
})

module.exports = app