const mongoose = require('mongoose');
const Logger = require('./logger').pino
const Config = require('../config')

mongoose.connection.on('connected', () => Logger.info('connected'));
mongoose.connection.on('open', () => Logger.info('open'));
mongoose.connection.on('disconnected', () => Logger.error('disconnected'));
mongoose.connection.on('reconnected', () => Logger.info('reconnected'));
mongoose.connection.on('disconnecting', () => Logger.error('disconnecting'));
mongoose.connection.on('close', () => Logger.info('close'));

mongoose.connect(`${Config.url_database}/${process.env.npm_lifecycle_event == 'test' ? "QUIZ_SERVER_TEST" : "QUIZ_SERVER_PRODUCTION"}`, {
  useUnifiedTopology: true});
