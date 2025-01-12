const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const router = express.Router();

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project-intern",
});

// Endpoint untuk register
router.post("/register", (req, res) => {
  const { name, emailId, password, role } = req.body;

  if (!name || !emailId || !password || !role) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [emailId], async (err, results) => {
    if (err) {
      console.error("Database error:", err); // Menampilkan error di konsol
      return res.status(500).json({ message: "Database error!", error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [name, emailId, hashedPassword, role], (err, result) => {
      if (err) {
        console.error("Database error during insert:", err); // Menampilkan error saat insert
        return res.status(500).json({ message: "Database error during insert!", error: err });
      }

      return res.status(201).json({ message: "User registered successfully!" });
    });
  });
});

module.exports = router;
