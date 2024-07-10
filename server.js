const express = require('express');

const app = express();

//Démarrage de notre serveur sur le port choisi
app.listen(Config.port, () => {
  Logger.info(`Serveur démarré sur le port ${Config.port}`)
})

module.exports = app