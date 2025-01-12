const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project-intern",
});


router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: "Email is required!" });
  }

  console.log(`Password reset link sent to: ${email}`);

  res.setHeader('Content-Type', 'application/json'); // Pastikan header ini dikirim
  res.status(200).json({ message: "Password reset link sent!" });
});




module.exports = router;
