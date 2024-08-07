const mongoose = require('mongoose');
const Logger = require('./logger').pino

mongoose.connection.on('connected', () => Logger.info('connected'));
mongoose.connection.on('open', () => Logger.info('open'));
mongoose.connection.on('disconnected', () => Logger.error('disconnected'));
mongoose.connection.on('reconnected', () => Logger.info('reconnected'));
mongoose.connection.on('disconnecting', () => Logger.error('disconnecting'));
mongoose.connection.on('close', () => Logger.info('close'));

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.npm_lifecycle_event == 'test' ? "QUIZ_SERVER_TEST" : "QUIZ_SERVER_PRODUCTION"}`);
