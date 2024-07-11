const mongoose = require('mongoose');
const _ = require('lodash');
const userSchema = require('../schemas/User');
const async = require('async');
const ObjectId = mongoose.Types.ObjectId

const User = mongoose.model('User', userSchema);

User.createIndexes();

module.exports.addOneUser = async function (user, callback) {
  try {
      var new_user = new User(user);
      var errors = new_user.validateSync();
      if (errors) {
          errors = errors['errors'];
          var text = Object.keys(errors).map((e) => {
              return errors[e]['properties']['message'];
          }).join(' ');
          var fields = _.transform(Object.keys(errors), function (result, value) {
              result[value] = errors[value]['properties']['message'];
          }, {});
          var err = {
              msg: text,
              fields_with_error: Object.keys(errors),
              fields: fields,
              type_error: "validator"
          };
          callback(err);
      } else {
          await new_user.save();
          callback(null, new_user.toObject());
      }
  } catch (error) {
      if (error.code === 11000) { // Erreur de duplicité
          var field = Object.keys(error.keyValue)[0];
          var err = {
              msg: `Duplicate key error: ${field} must be unique.`,
              fields_with_error: [field],
              fields: { [field]: `The ${field} is already taken.` },
              type_error: "duplicate"
          };
          callback(err);
      } else {
          callback(error); // Autres erreurs
      }
  }
};

module.exports.addManyUsers = async function (users, callback) {
    var errors = [];
    
    // Vérifier les erreurs de validation
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var new_user = new User(user);
        var error = new_user.validateSync();
        if (error) {
            error = error['errors'];
            var text = Object.keys(error).map((e) => {
                return error[e]['properties']['message'];
            }).join(' ');
            var fields = _.transform(Object.keys(error), function (result, value) {
                result[value] = error[value]['properties']['message'];
            }, {});
            errors.push({
                msg: text,
                fields_with_error: Object.keys(error),
                fields: fields,
                index: i,
                type_error: "validator"
            });
        }
    }
    
    if (errors.length > 0) {
        callback(errors);
    } else {
        try {
            // Tenter d'insérer les utilisateurs
            const data = await User.insertMany(users, { ordered: false });
            callback(null, data);
        } catch (error) {
            if (error.code === 11000) { // Erreur de duplicité
                const duplicateErrors = error.writeErrors.map(err => {
                    const field = err.err.errmsg.split(" dup key: { ")[1].split(':')[0].trim(); // Big brain
                    return {
                        msg: `Duplicate key error: ${field} must be unique.`,
                        fields_with_error: [field],
                        fields: { [field]: `The ${field} is already taken.` },
                        index: err.index,
                        type_error: "duplicate"
                    };
                });
                callback(duplicateErrors);
            } else {
                callback(error); // Autres erreurs
            }
        }
    }
};