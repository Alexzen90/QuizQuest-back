const QuestionSchema = require('../schemas/Question')
const _ = require('lodash')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var Question = mongoose.model('Question', QuestionSchema)

Question.createIndexes()

module.exports.addOneQuestion = async function (question, options, callback) {
    try {
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
            callback(err)
        } else {
            await new_question.save();
            callback(null, new_question.toObject())
        }
    } catch (error) {
        console.log(error)
        callback(error)
    }
};

module.exports.addManyQuestions = async function (questions, options, callback) {
    var errors = []
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
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
    let opts = {populate: options && options.populate ? ["user_id", "quiz_id", "categorie_id"] : []}

    if (question_id && mongoose.isValidObjectId(question_id)) {
        Question.findById(question_id, null, opts).then((value) => {
            try {
                if (value) {
                    callback(null, value.toObject());
                } else {
                    callback({ msg: "Aucune question trouvé.", type_error: "no-found" });
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
    let opts = {populate: (options && options.populate ? ['user_id', 'quiz_id', 'categorie_id'] : []), lean: true}

    if (questions_id && Array.isArray(questions_id) && questions_id.length > 0 && questions_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == questions_id.length) {
        questions_id = questions_id.map((e) => { return new ObjectId(e) })
        Question.find({ _id: questions_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucune question trouvé.", type_error: "no-found" });
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

module.exports.findOneQuestion = function (tab_field, value, options, callback) {
    let opts = {populate: options && options.populate ? ['user_id', 'categorie_id', 'quiz_id'] : []}
    var field_unique = ['question', 'quiz_id', 'categorie_id']

    if (tab_field && Array.isArray(tab_field) && value && _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1}).length == 0) {
        var obj_find = []
        _.forEach(tab_field, (e) => {
            obj_find.push({[e]: value})
        })
        Question.findOne({ $or: obj_find}, null, opts).then((value) => {
            if (value){
                callback(null, value.toObject())
            }else {
                callback({msg: "Question non trouvée.", type_error: "no-found"})
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

module.exports.findManyQuestions = function(search, limit, page, options, callback) {
    let populate = options && options.populate ? ['user_id', 'quiz_id', 'categorie_id'] : []
    page = !page ? 1 : parseInt(page)
    limit = !limit ? 10 : parseInt(limit)
    
    if (typeof page !== "number" || typeof limit !== "number" || isNaN(page) || isNaN(limit)) {
        callback ({msg: `format de ${typeof page !== "number" ? "page" : "limit"} est incorrect`, type_error: "no-valid"})
    }else{
        if (limit == 0) {
            limit = null
        }
        let query_mongo = {}
        if (mongoose.isValidObjectId(search)) {
            query_mongo = {
                $or: [
                    { quiz_id: new ObjectId(search) },
                    { categorie_id: new ObjectId(search) },
                    { user_id: new ObjectId(search) }
                ]
            };
        } else {
            query_mongo["question"] = { $regex: search, $options: 'i' };
        }
        
        Question.countDocuments(query_mongo).then((value) => {
            if (value > 0) {
                const skip = ((page - 1) * limit)
                Question.find(query_mongo, null, {skip:skip, limit:limit, populate: populate, lean: true}).then((results) => {
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