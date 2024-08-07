const QuizService = require('../../services/QuizService')
const UserService = require('../../services/UserService')
const CategorieService = require('../../services/CategorieService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_quiz_valid = ""
var tab_id_quizzes = []
var tab_id_users = []
var quizzes = []

let users = [
    {
        name: "Détenteur de categorie 1",
        username: "oui1",
        email:"iencli1@gmail.com",
        password: "1234"
    },
    {
        name: "Détenteur de categorie 2",
        username: "oui2",
        email:"iencli2@gmail.com",
        password: "1234"
    },
    {
        name: "Détenteur de categorie 3",
        username: "oui3",
        email:"iencli3@gmail.com",
        password: "1234"
    },
    {
        name: "Détenteur de categorie 4",
        username: "oui4",
        email:"iencli4@gmail.com",
        password: "1234"
    },
];

it("Création des utilisateurs fictif", (done) => {
    UserService.addManyUsers(users, null, function (err, value) {
        tab_id_users = _.map(value, '_id')
        done()
    })
})

it("Authentification d'un utilisateur fictif.", (done) => {
    UserService.loginUser('oui4', "1234", null, function(err, value) {
        valid_token = value.token
        done()
    })
})

function rdm_user (tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

describe("addOneQuiz", () => {
    it("Quiz correct. - S", (done) => {
        var quiz = {
            created_by: rdm_user(tab_id_users),
            name: "Quiz sur Naruto",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
        }
        QuizService.addOneQuiz(quiz, null, function(err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            id_quiz_valid = value._id
            quizzes.push(value)
            done()
        })
    })
    it("Quiz incorrect. (Sans name) - E", (done) => {
        var quiz_no_valid = {
          created_by: rdm_user(tab_id_users),
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
        }
        QuizService.addOneQuiz(quiz_no_valid,  null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
    it("Quiz incorrect. (name vide) - E", (done) => {
        var quiz_no_valid = {
          created_by: rdm_user(tab_id_users),
            name: "",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
        }
        QuizService.addOneQuiz(quiz_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("addManyQuizzes", () => {
  it("Quizzes à ajouter, valide. - S", (done) => {
      var quizzes_tab = [{
        created_by: rdm_user(tab_id_users),
            name: "test1",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
      }, {
        created_by: rdm_user(tab_id_users),
            name: "test2",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
      },
      {
        created_by: rdm_user(tab_id_users),
            name: "test3",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
      }]

      QuizService.addManyQuizzes(quizzes_tab, null, function (err, value) {
          tab_id_quizzes = _.map(value, '_id')
          quizzes = [...value, ...quizzes]
          expect(value).lengthOf(3)
          done()
      })
  })
  it("Quizzes à ajouter, non valide. (name vide) - E", (done) => {
      var quizzes_tab_error = [{
        created_by: rdm_user(tab_id_users),
            name: "",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
      }, {
        created_by: rdm_user(tab_id_users),
            name: "bbbbbbbbbbb",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
      },
      {
        created_by: rdm_user(tab_id_users),
            name: "aaaaa",
            categorie: "Manga/Anime",
            question1: {
              difficulty: "Facile",
              question: "Qui est le créateur de la série Naruto ?",
              correct_answer: "Masashi Kishimoto",
              incorrect_answers: ["Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"]
            },
            question2: {
              difficulty: "Facile",
              question: "Quelle bête à 9 queues est scellée à l'intérieur de Naruto ?",
              correct_answer: "Kyūbi (Kurama)",
              incorrect_answers: ["Ichibi (Shukaku)", "Nibi (Matatabi)", "Yonbi (Son Goku)"]
            },
            question3: {
              difficulty: "Facile",
              question: "Qui est le sensei de Naruto lors de son apprentissage avec les crapauds ?",
              correct_answer: "Jiraiya",
              incorrect_answers: ["Iruka", "Kakashi", "Tsunade"]
            },
            question4: {
              difficulty: "Facile",
              question: "Quel est le nom de l'organisation criminelle composée de ninjas déserteurs dans Naruto ?",
              correct_answer: "Akatsuki",
              incorrect_answers: ["Anbu", "Gotei 13", "Phantom Troupe"]
            },
            question5: {
              difficulty: "Moyen",
              question: "Qui est le leader originel de l'Akatsuki ?",
              correct_answer: "Yahiko",
              incorrect_answers: ["Madara Uchiha", "Obito Uchiha", "Zetsu"]
            },
            question6: {
              difficulty: "Moyen",
              question: "Quelle est la spécialité du clan Aburame ?",
              correct_answer: "Contrôle des insectes",
              incorrect_answers: ["Manipulation de l'ombre", "Contrôle mental", "Maitrise du Byakugan"]
            },
            question7: {
              difficulty: "Moyen",
              question: "Qui a été le sensei d'Obito Uchiha ?",
              correct_answer: "Minato Namikaze",
              incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
            },
            question8: {
              difficulty: "Difficile",
              question: "Quel est le nom de la technique secrète de Shikamaru Nara pour immobiliser ses ennemis ?",
              correct_answer: "Kagemane no Jutsu",
              incorrect_answers: ["Kage Kubi Shibari no Jutsu", "Kuchiyose No Jutsu", "Kageyose no Jutsu"]
            },
            question9: {
              difficulty: "Difficile",
              question: "Quel est le nom de l'épée légendaire brandie par Zabuza Momochi ?",
              correct_answer: "Kubikiribōchō",
              incorrect_answers: ["Samehada", "Kusanagi", "Gunbai"]
            },
            question10: {
              difficulty: "Dificile",
              question: "Quel est le nom de la mère d'Itachi et de Sasuke Uchiha ?",
              correct_answer: "Mikoto Uchiha",
              incorrect_answers: ["Makoto Uchiha", "Mokoto Uchiha", "Maokoto Uchiha"]
            }
      }]

      QuizService.addManyQuizzes(quizzes_tab_error, null, function (err, value) {
          expect(err[0]).to.haveOwnProperty('msg')
          expect(err[0]).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
          expect(err[0]).to.haveOwnProperty('fields')
          expect(err[0]).to.haveOwnProperty('index')
          expect(err[0]['fields']).to.haveOwnProperty('name')
          expect(err[0]['fields']['name']).to.equal('Path `name` is required.')
          expect(err[0]['index']).to.equal(0)
          done()
      })
  })
})

describe("findOneQuizById", () => {
    it("Chercher un quiz existant avec un id correct. - S", (done) => {
        QuizService.findOneQuizById(id_quiz_valid, null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher un quiz inexistant avec un id correct. - E", (done) => {
        QuizService.findOneQuizById("6694e40466b1fde90ef8f1f9", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-found')
            done()
        })
    })
    it("Chercher un quiz avec un id invalide. - E", (done) => {
        QuizService.findOneQuizById("6694", null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyQuizzesById", () => {
    it("Chercher des quizzes existants. - S", (done) => {
        QuizService.findManyQuizzesById(tab_id_quizzes, null, function (err, value) {
            expect(value).lengthOf(3)
            done()
        })
    })
    it("Chercher des quizzes inexistants ou incorrects. - E", (done) => {
        QuizService.findManyQuizzesById(['110155', '6694e3d6bc85790ed4801278', '61'], null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('fields')
            expect(err['type_error']).to.equal('no-valid')
            expect(err['fields']).to.have.lengthOf(2)
            done()
        })
    })
})

describe("updateOneQuiz", () => {
    it("Modifier un quiz correct. - S", (done) => {
        QuizService.updateOneQuiz(id_quiz_valid, { categorie: "Animaux" }, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('question1')
            expect(value).to.haveOwnProperty('updated_at')
            expect(value['categorie']).to.be.equal('Animaux')
            done()

        })
    })
    it("Modifier un quiz correct (question de la question1). - S", (done) => {
      QuizService.updateOneQuiz(id_quiz_valid, { "question1.question": "Ou se cachent les animaux ?" }, null, function (err, value) {
          expect(value).to.be.a('object')
          expect(value).to.haveOwnProperty('_id')
          expect(value).to.haveOwnProperty('question1')
          expect(value).to.haveOwnProperty('updated_at')
          expect(value['question1']['question']).to.be.equal('Ou se cachent les animaux ?')
          done()

      })
    })
    it("Modifier un quiz avec id incorrect. - E", (done) => {
        QuizService.updateOneQuiz("1200", { categorie: "Animaux" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un quiz avec des champs requis vide. - E", (done) => {
        QuizService.updateOneQuiz(id_quiz_valid, { name: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("updateManyQuizzes", () => {
    it("Modifier plusieurs quizzes correctement. - S", (done) => {
        QuizService.updateManyQuizzes(tab_id_quizzes, { categorie: "Fonds marins" }, null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_quizzes.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_quizzes.length)
            done()

        })
    })
    it("Modifier plusieurs quizzes avec id incorrect. - E", (done) => {
        QuizService.updateManyQuizzes("1200", { categorie: "Fonds marins" }, null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs quizzes avec des champs requis vide. - E", (done) => {
        QuizService.updateManyQuizzes(tab_id_quizzes, { name: "" }, null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("deleteOneQuiz", () => {
    it("Supprimer un quiz correct. - S", (done) => {
        QuizService.deleteOneQuiz(id_quiz_valid, null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Supprimer un quiz avec id incorrect. - E", (done) => {
        QuizService.deleteOneQuiz("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un quiz avec un id inexistant. - E", (done) => {
        QuizService.deleteOneQuiz("665f00c6f64f76ba59361e9f", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyQuizzes", () => {
    it("Supprimer plusieurs quizzes correctement. - S", (done) => {
        QuizService.deleteManyQuizzes(tab_id_quizzes, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_quizzes.length)
            done()

        })
    })
    it("Supprimer plusieurs quizzes avec id incorrect. - E", (done) => {
        QuizService.deleteManyQuizzes("1200", null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
});

it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
        done()
    })
})