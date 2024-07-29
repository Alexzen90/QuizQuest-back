const QuizSchema = require('../schemas/Quiz')
const _ = require('lodash')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var Quiz = mongoose.model('Quiz', QuizSchema)

Quiz.createIndexes()

module.exports.addOneQuiz = async function (quiz, options, callback) {
    try {
        quiz.categorie_id = options && options.categorie ? options.categorie._id : quiz.categorie_id
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
        console.log(error)
        callback(error); // Autres erreurs
    }
};

module.exports.addManyQuizzes = async function (quizzes, options, callback) {
    var errors = [];
    // Vérifier les erreurs de validation
    for (var i = 0; i < quizzes.length; i++) {
        var quiz = quizzes[i];
        quiz.categorie_id = options && options.categorie ? options.categorie._id : quiz.categorie_id
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
    let opts = {populate: (options && options.populate ? ['user_id'] : []), lean: true}

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