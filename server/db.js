const mysql = require("mysql")

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'social',
});

connection.connect(function(err) {
  if (err) {
      console.error('Error connecting to the database:', err.code);
      console.error(err);
      return;
  }
  console.log("Database connected");
});

  module.exports = connection