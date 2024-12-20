const mongoose = require('mongoose');

// Middleware pour vérifier si la database est connectée
module.exports.checkConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    req.log.info('Database connected');
    next();
  } else {
    req.log.error('Database not connected');
    res.status(500).send('Service Unavailable: Database not connected');
  }
};