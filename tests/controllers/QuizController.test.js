const UserService = require('../../services/UserService')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
const _ = require('lodash')
let should = chai.should();
var tab_id_users = []
var quizzes = []
let token

let users = [
  {
      name: "Détenteur de quiz 1",
      username: "oui1",
      email:"iencli1@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de quiz 2",
      username: "oui2",
      email:"iencli2@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de quiz 3",
      username: "oui3",
      email:"iencli3@gmail.com",
      password: "1234"
  },
  {
      name: "Détenteur de quiz 4",
      username: "oui4",
      email:"iencli4@gmail.com",
      password: "1234"
  },
];

describe("POST - /users", () => {
    it("Création des utilisateurs fictifs", (done) => {
        UserService.addManyUsers(users, null, function (err, value) {
            tab_id_users = _.map(value, '_id')
            done()
        })
    })
})

describe("POST - /login", () => {
    it("Authentification d'un utilisateur fictif.", (done) => {
        UserService.loginUser('oui4', "1234", null, function(err, value) {
            token = value.token
            done()
        })
    })
})

function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))]
    return rdm_id
}

chai.use(chaiHttp)


describe("POST - /quiz", () => {
    it("Ajouter un quiz. - S", (done) => {
        chai.request(server).post('/quiz').auth(token, { type: 'bearer' }).send({
          created_by: rdm_user(tab_id_users),
          name: "Quiz sur Naruto",
          categorie: "Manga/Anime",
          question1: {
            difficulty: "Facile",
            question: "Qui est le créateur du manga Naruto ?",
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
            question: "Qui était le sensei d'Obito Uchiha ?",
            correct_answer: "Minato Namikaze",
            incorrect_answers: ["Jiraiya", "Hiruzen Sarutobi", "Kakashi"]
          },
          question8: {
            difficulty: "Difficile",
            question: "Quel est le nom de la technique secrète de Shikamaru pour immobiliser ses ennemis ?",
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
        }).end((err, res) => {
            expect(res).to.have.status(201)
            quizzes.push(res.body)
            done()
        });
    })
    it("Ajouter un quiz incorrect. (Sans name) - E", (done) => {
        chai.request(server).post('/quiz').send({
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
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un quiz incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/quiz').send({
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
        })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("POST - /quizzes", () => {
    it("Ajouter des quizzes. - S", (done) => {
        chai.request(server).post('/quizzes').auth(token, { type: 'bearer' }).send([
          {
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
          }
        ]).end((err, res) => {
            expect(res).to.have.status(201)
            quizzes = [...quizzes, ...res.body]
            done()
        });
    })
    it("Ajouter des quizzes incorrecte. - E", (done) => {
        chai.request(server).post('/quizzes').auth(token, { type: 'bearer' }).send([
          {
            created_by: rdm_user(tab_id_users),
                name: "test1",
                categorie: "Manga/Anime",
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
        ]).end((err, res) => {
            expect(res).to.have.status(405)   
            done()
        });
    })
    it("Ajouter des quizzes sans etre authentifié. - E", (done) => {
        chai.request(server).post('/quizzes').send([
          {
            created_by: rdm_user(tab_id_users),
                name: "test6",
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
                name: "test5",
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
                name: "test4",
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
        ]).end((err, res) => {
            expect(res).to.have.status(401)
            done()
        });
    })
})

describe("GET - /quiz/:id", () => {
    it("Chercher un quiz correct. - S", (done) => {
        chai.request(server).get('/quiz/' + quizzes[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Chercher un quiz sans etre authentifié. - E", (done) => {
        chai.request(server).get('/quiz/' + quizzes[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher un quiz incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/quiz/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher un quiz incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).get('/quiz/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    
})

describe("GET - /quizzes", () => {
    it("Chercher plusieurs quizzes. - S", (done) => {
        chai.request(server).get('/quizzes').query({id: _.map(quizzes, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body).to.be.an('array')
            done()
        })
    })
    it("Chercher plusieurs quizzes sans etre authentifié. - E", (done) => {
        chai.request(server).get('/quizzes').query({id: _.map(quizzes, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Chercher plusieurs quizzes incorrectes (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/quizzes').query({id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"]})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs quizzes incorrectes (avec un id invalide). - E", (done) => {
        chai.request(server).get('/quizzes').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /quiz", () => {
    it("Modifier un quiz. - S", (done) => {
        chai.request(server).put('/quiz/' + quizzes[0]._id).send({ categorie: "La faune et la flore" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Modifier un quiz sans etre authentifié. - E", (done) => {
        chai.request(server).put('/quiz/' + quizzes[0]._id).send({ categorie: "Les objets suspects" })
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Modifier un quiz avec un id invalide. - E", (done) => {
        chai.request(server).put('/quiz/123456789').send({ categorie: "La plage" })
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un quiz avec un id inexistant. - E", (done) => {
        chai.request(server).put('/quiz/66791a552b38d88d8c6e9ee7').send({ categorie: "Monts et merveilles"})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier un quiz avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/quiz/' + quizzes[0]._id).send({name: ""})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /quizzes", () => {
  it("Modifier plusieurs quizzes. - S", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ categorie: "Les voitures" })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(200)
          done()
      })
  })
  it("Modifier plusieurs quizzes sans etre authentifié. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ categorie: "Les voitures" })
      .end((err, res) => {
          res.should.have.status(401)
          done()
      })
  })
  it("Modifier plusieurs quizzes avec des ids invalide. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: ['267428142', '41452828']}).send({ categorie: "Les voitures" })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })

  it("Modifier plusieurs quizzes avec des ids inexistants. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: ['66791a552b38d88d8c6e9ee7', '667980886db560087464d3a7']})
      .auth(token, { type: 'bearer' })
      .send({ categorie: "Les voitures" })
      .end((err, res) => {
          res.should.have.status(404)
          done()
      })
  })

  it("Modifier des quizzes avec un champ requis vide. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ name: ""})
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })

  it("Modifier des quizzes avec un champ unique existant. - E", (done) => {
      chai.request(server).put('/quizzes').query({id: _.map(quizzes, '_id')}).send({ name: quizzes[1].name })
      .auth(token, { type: 'bearer' })
      .end((err, res) => {
          res.should.have.status(405)
          done()
      })
  })
})

describe("DELETE - /quiz", () => {
    it("Supprimer une quiz. - S", (done) => {
        chai.request(server).delete('/quiz/' + quizzes[0]._id)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer une quiz sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/quiz/' + quizzes[0]._id)
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer une quiz incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/quiz/665f18739d3e172be5daf092')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer une quiz incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/quiz/123')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /quizzes", () => {
    it("Supprimer plusieurs quizzes. - S", (done) => {
        chai.request(server).delete('/quizzes').query({id: _.map(quizzes, '_id')})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer plusieurs quizzes sans etre authentifié. - E", (done) => {
        chai.request(server).delete('/quizzes').query({id: _.map(quizzes, '_id')})
        .end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
    it("Supprimer plusieurs quizzes incorrectes (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/quizzes/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs quizzes incorrectes (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/quizzes').query({id: ['123', '456']})
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /users", () => {
    it("Suppression des utilisateurs fictif", (done) => {
        UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
            done()
        })
    })  
})
