const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project-intern",
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to database:", err.stack);
    return;
  }
  console.log("Database connected successfully.");
});

module.exports = { db };
