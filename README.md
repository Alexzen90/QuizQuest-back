# QuizQuest back

##Arboresence fichier et dossier:
  - controllers       Ils reçoivent les requêtes - UserController -> recoit les requêtes, verifie
                      les droits et le retour des codes erreurs puis dirige vers les services
  - services          Les fonctions qui interagissent directement avec la base de données. Chercher
                      modifier supprimer, etc.. (login)
  - schemas           Contient des informations de structure de la base de données par schéma ou table
  - middlewares       Les fonctions HTTP de middleware qui verifier que les conditions sont 
                      requises pour accéder aux controllers.
  - utils             Toutes les fonctions annexes et reutilisables du code.
  - tests             Il contient les tests de toutes les fonctions.
    - services        Les tests des fonctions services.
    - controllers     Les tests des fonctions de controllers.
    index.js          Il pilote tous les tests.
  - events            Il contient tous les événements qui peuvent se produire dans le logiciel
                      (connexion à la base de données, modification ou creation d'éléments dans
                      la base de données).
  - logs              Il contient les logs de l'application.
  config.js           Il contient les configurations de l'application (secret_key, port, etc..).
  server.js           Le  point d'entrée de l'application. Il contient tous les endpoints 
                      qui dirigent vers les bons controllers. Il initialise aussi les middlewares 
                      et autres systèmes de l'application.