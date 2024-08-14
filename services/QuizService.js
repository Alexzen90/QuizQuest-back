const QuizSchema = require('../schemas/Quiz')
const _ = require('lodash')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var Quiz = mongoose.model('Quiz', QuizSchema)

Quiz.createIndexes()

module.exports.addOneQuiz = async function (quiz, options, callback) {
    try {
        quiz.user_id = options && options.user ? options.user._id : quiz.user_id
        var new_quiz = new Quiz(quiz);
        var errors = new_quiz.validateSync();
        if (errors) {
            errors = errors['errors'];
            var text = Object.keys(errors).map((e) => {
                return errors[e]['properties'] ? errors[e]['properties']['message']:errors[e]['reason'] ;
            }).join(' ');
            var fields = _.transform(Object.keys(errors), function (result, value) {
                result[value] = errors[value]['properties'] ? errors[value]['properties']['message']:String(errors[value]['reason']) ;
            }, {});
            var err = {
                msg: text,
                fields_with_error: Object.keys(errors),
                fields: fields,
                type_error: "validator"
            };
            callback(err);
        } else {
            await new_quiz.save();
            callback(null, new_quiz.toObject());
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

module.exports.addManyQuizzes = async function (quizzes, options, callback) {
    var errors = [];
    // Vérifier les erreurs de validation
    for (var i = 0; i < quizzes.length; i++) {
        var quiz = quizzes[i];
        quiz.user_id = options && options.user ? options.user._id : quiz.user_id
        var new_quiz = new Quiz(quiz);
        var error = new_quiz.validateSync();
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
            const data = await Quiz.insertMany(quizzes, { ordered: false });
            callback(null, data);
        } catch (error) {
            if (error.code === 11000) { // Erreur de duplicité
                const duplicateErrors = error.writeErrors.map(err => {
                    //const field = Object.keys(err.keyValue)[0];
                    const field = err.err.errmsg.split(" dup key: { ")[1].split(':')[0].trim();
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

module.exports.findOneQuizById = function (quiz_id, options, callback) {
    let opts = {populate: options && options.populate ? ["user_id"] : []}

    if (quiz_id && mongoose.isValidObjectId(quiz_id)) {
        Quiz.findById(quiz_id, null, opts).then((value) => {
            try {
                if (value) {
                    callback(null, value.toObject());
                } else {
                    callback({ msg: "Aucun quiz trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
                console.log(e)
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    } else {
        callback({ msg: "ObjectId non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findManyQuizzesById = function (quizzes_id, options, callback) {
    let opts = {populate: (options && options.populate ? ['user_id', 'categorie_id'] : []), lean: true}

    if (quizzes_id && Array.isArray(quizzes_id) && quizzes_id.length > 0 && quizzes_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == quizzes_id.length) {
        quizzes_id = quizzes_id.map((e) => { return new ObjectId(e) })
        Quiz.find({ _id: quizzes_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun quiz trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
                console.log(e)
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (quizzes_id && Array.isArray(quizzes_id) && quizzes_id.length > 0 && quizzes_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != quizzes_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: quizzes_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (quizzes_id && !Array.isArray(quizzes_id)) {
        callback({ msg: "L'argument n'est pas un tableau.", type_error: 'no-valid' });
    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findOneQuiz = function (tab_field, value, options, callback) {
    let opts = {populate: options && options.populate ? ['user_id', 'categorie_id'] : []}
    var field_unique = ['name', 'categorie_id']

    if (tab_field && Array.isArray(tab_field) && value && _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1}).length == 0) {
        var obj_find = []
        _.forEach(tab_field, (e) => {
            obj_find.push({[e]: value})
        })
        Quiz.findOne({ $or: obj_find}, null, opts).then((value) => {
            if (value){
                callback(null, value.toObject())
            }else {
                callback({msg: "Quiz non trouvé.", type_error: "no-found"})
            }
        }).catch((err) => {
            callback({msg: "Error interne mongo", type_error:'error-mongo'})
        })
    }
    else {
        let msg = ''
        if(!tab_field || !Array.isArray(tab_field)) {
            msg += "Les champs de recherche sont incorrecte."
        }
        if(!value){
            msg += msg ? " Et la valeur de recherche est vide" : "La valeur de recherche est vide"
        }
        if(_.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1}).length > 0) {
            var field_not_authorized = _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1})
            msg += msg ? ` Et (${field_not_authorized.join(',')}) ne sont pas des champs de recherche autorisé.` : 
            `Les champs (${field_not_authorized.join(',')}) ne sont pas des champs de recherche autorisé.`
            callback({ msg: msg, type_error: 'no-valid', field_not_authorized: field_not_authorized })
        }
        else{
            callback({ msg: msg, type_error: 'no-valid'})
        }
    }
}

module.exports.findManyQuizzes = function(search, limit, page, options, callback) {
    let populate = options && options.populate ? ['user_id', 'categorie_id'] : []
    page = !page ? 1 : parseInt(page)
    limit = !limit ? 10 : parseInt(limit)

    if (typeof page !== "number" || typeof limit !== "number" || isNaN(page) || isNaN(limit)) {
        callback ({msg: `format de ${typeof page !== "number" ? "page" : "limit"} est incorrect`, type_error: "no-valid"})
    }else{
        let query_mongo = {}        
        if (mongoose.isValidObjectId(search)) {
            query_mongo = {
                $or: [
                    { categorie_id: new ObjectId(search) },
                    { user_id: new ObjectId(search) }
                ]
            };
        } else {
            if (typeof search !== 'string') {
                search = String(search);
              }
            query_mongo["name"] = { $regex: search, $options: 'i' };
        }
        Quiz.countDocuments(query_mongo).then((value) => {
            if (value > 0) {
                const skip = ((page - 1) * limit)
                Quiz.find(query_mongo, null, {skip:skip, limit:limit, populate: populate, lean: true}).then((results) => {
                    callback(null, {
                        count: value,
                        results: results
                    })
                })
            }else{
                callback(null, {count: 0, results: []})
            }
        }).catch((e) => {
            callback(e)
        })
    }
}

module.exports.updateOneQuiz = function (quiz_id, update, options, callback) {
    update.user_id = options && options.user ? options.user._id : update.user_id
    update.updated_at = new Date()

    if (quiz_id && mongoose.isValidObjectId(quiz_id)) {
        Quiz.findByIdAndUpdate(new ObjectId(quiz_id), update, { returnDocument: 'after', runValidators: true }).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Quiz non trouvé.", type_error: "no-found" });
            } catch (e) {
                callback(e)
            }
        }).catch((errors) => {
            if(errors.code === 11000){
                var field = Object.keys(errors.keyPattern)[0]
                const duplicateErrors = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                };
                callback(duplicateErrors)
            }else {
                errors = errors['errors']
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}


module.exports.updateManyQuizzes = function (quizzes_id, update, options, callback) {
    update.user_id = options && options.user ? options.user._id : update.user_id
    update.updated_at = new Date()

    if (quizzes_id && Array.isArray(quizzes_id) && quizzes_id.length > 0 && quizzes_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == quizzes_id.length) {
        quizzes_id = quizzes_id.map((e) => { return new ObjectId(e) })
        Quiz.updateMany({ _id: quizzes_id }, update, { runValidators: true }).then((value) => {
            try {
                if(value && value.matchedCount != 0){
                    callback(null, value)
                }else {
                    callback({msg: 'Utilisateurs non trouvé', type_error: 'no-found'})
                }
            } catch (e) {
                callback(e)
            }
        }).catch((errors) => {
            if(errors.code === 11000){
                var field = Object.keys(errors.keyPattern)[0]
                const duplicateErrors = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    index: errors.index,
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                };
                callback(duplicateErrors)
            }else {
                errors = errors['errors']
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.deleteOneQuiz = function (quiz_id, options, callback) {
    let opts = options

    if (quiz_id && mongoose.isValidObjectId(quiz_id)) {
        Quiz.findByIdAndDelete(quiz_id).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Quiz non trouvé.", type_error: "no-found" });
            }
            catch (e) {
                
                callback(e)
            }
        }).catch((e) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.deleteManyQuizzes = function (quizzes_id, options, callback) {
    let opts = options

    if (quizzes_id && Array.isArray(quizzes_id) && quizzes_id.length > 0 && quizzes_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == quizzes_id.length) {
        quizzes_id = quizzes_id.map((e) => { return new ObjectId(e) })
        Quiz.deleteMany({ _id: quizzes_id }).then((value) => {
            callback(null, value)
        }).catch((err) => {
            callback({ msg: "Erreur mongo suppression.", type_error: "error-mongo" });
        })
    }
    else if (quizzes_id && Array.isArray(quizzes_id) && quizzes_id.length > 0 && quizzes_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != quizzes_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: quizzes_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (quizzes_id && !Array.isArray(quizzes_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}