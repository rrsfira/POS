const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("../database/db");
const jwt = require("jsonwebtoken"); // Tambahkan JWT
const router = express.Router();

// Secret key untuk JWT (gantikan dengan key aman)
const JWT_SECRET = "your_secret_key";

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Cari user berdasarkan email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error!' });
    }

    // Jika user tidak ditemukan
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const user = results[0];

    // Verifikasi password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error during password comparison!' });
      }

      if (isMatch) {
        // Role-based validation
        if (user.role === 'Admin'){
          // Buat JWT untuk admin
          const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
          );

          return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        } else if (user.role === 'Cashier'|| user.role === 'Manager') {
          // Respons untuk role yang belum memiliki akses
          return res.status(403).json({
            message: `Access for ${user.role} is not available yet. Please wait for further updates.`,
          });
        } else {
          return res.status(400).json({ message: 'Invalid role!' });
        }
      } else {
        // Jika password salah
        return res.status(400).json({ message: 'Invalid email or password!' });
      }
    });
  });
});

module.exports = router;
