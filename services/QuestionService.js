const QuestionSchema = require('../schemas/Question')
const _ = require('lodash')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var Question = mongoose.model('Question', QuestionSchema)

Question.createIndexes()

module.exports.addOneQuestion = async function (question, options, callback) {
    try {
        question.categorie_id = options && options.categorie ? options.categorie._id : question.categorie_id
        var new_question = new Question(question);
        var errors = new_question.validateSync();
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
            await new_question.save();
            callback(null, new_question.toObject());
        }
    } catch (error) {
        console.log(error)
        callback(error); // Autres erreurs
    }
};

module.exports.addManyQuestions = async function (questions, options, callback) {
    var errors = [];
    // Vérifier les erreurs de validation
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        question.categorie_id = options && options.categorie ? options.categorie : question.categorie_id
        // console.log("LAAAAAAAAAAAAAAAAAAAAAAAA1", options);
        // console.log("LAAAAAAAAAAAAAAAAAAAAAAAA2", options.categorie);
        // console.log("LAAAAAAAAAAAAAAAAAAAAAAAAAAA3", question);
        var new_question = new Question(question);
        var error = new_question.validateSync();
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
        console.log(errors)
        callback(errors);
    } else {
        try {
            // Tenter d'insérer les questions
            const data = await Question.insertMany(questions, { ordered: false });
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

module.exports.findOneQuestionById = function (question_id, options, callback) {
    let opts = {populate: options && options.populate ? ["user_id"] : []}

    if (question_id && mongoose.isValidObjectId(question_id)) {
        Question.findById(question_id, null, opts).then((value) => {
            try {
                if (value) {
                    callback(null, value.toObject());
                } else {
                    callback({ msg: "Aucun question trouvé.", type_error: "no-found" });
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

module.exports.findManyQuestionsById = function (questions_id, options, callback) {
    let opts = {populate: (options && options.populate ? ['user_id'] : []), lean: true}

    if (questions_id && Array.isArray(questions_id) && questions_id.length > 0 && questions_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == questions_id.length) {
        questions_id = questions_id.map((e) => { return new ObjectId(e) })
        Question.find({ _id: questions_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun question trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
                console.log(e)
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (questions_id && Array.isArray(questions_id) && questions_id.length > 0 && questions_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != questions_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: questions_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (questions_id && !Array.isArray(questions_id)) {
        callback({ msg: "L'argument n'est pas un tableau.", type_error: 'no-valid' });
    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.updateOneQuestion = function (question_id, update, options, callback) {
    update.user_id = options && options.user ? options.user._id : update.user_id
    update.updated_at = new Date()

    if (question_id && mongoose.isValidObjectId(question_id)) {
        Question.findByIdAndUpdate(new ObjectId(question_id), update, { returnDocument: 'after', runValidators: true }).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Question non trouvé.", type_error: "no-found" });
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


module.exports.updateManyQuestions = function (questions_id, update, options, callback) {
    update.user_id = options && options.user ? options.user._id : update.user_id
    update.updated_at = new Date()

    if (questions_id && Array.isArray(questions_id) && questions_id.length > 0 && questions_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == questions_id.length) {
        questions_id = questions_id.map((e) => { return new ObjectId(e) })
        Question.updateMany({ _id: questions_id }, update, { runValidators: true }).then((value) => {
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

module.exports.deleteOneQuestion = function (question_id, options, callback) {
    let opts = options

    if (question_id && mongoose.isValidObjectId(question_id)) {
        Question.findByIdAndDelete(question_id).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Question non trouvé.", type_error: "no-found" });
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

module.exports.deleteManyQuestions = function (questions_id, options, callback) {
    let opts = options

    if (questions_id && Array.isArray(questions_id) && questions_id.length > 0 && questions_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == questions_id.length) {
        questions_id = questions_id.map((e) => { return new ObjectId(e) })
        Question.deleteMany({ _id: questions_id }).then((value) => {
            callback(null, value)
        }).catch((err) => {
            callback({ msg: "Erreur mongo suppression.", type_error: "error-mongo" });
        })
    }
    else if (questions_id && Array.isArray(questions_id) && questions_id.length > 0 && questions_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != questions_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: questions_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (questions_id && !Array.isArray(questions_id)) {
        callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}