require("dotenv").config();

module.exports.port = process.env.PORT || 3001;
module.exports.secret_key = process.env.SECRET_KEY || "MY_SECRET_KEY_HASH";
module.exports.secret_cookie = process.env.SECRET_COOKIE || "COOKIE";
module.exports.url_database =
  `${process.env.URL_DATABASE}:${process.env.PORT_BDD}` ||
  "mongodb://localhost:27017";
