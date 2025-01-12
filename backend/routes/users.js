const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { db } = require("../database/db");  

// Mendapatkan semua pengguna
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error('Error fetching users:', err); 
      return res.status(500).json({ error: "Gagal mendapatkan data pengguna" });
    }
    res.json(results);  // Mengirimkan hasil query dalam bentuk JSON
  });
});

// Endpoint untuk menambahkan pengguna baru
router.post("/", async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone, hashedPassword, role],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: "Gagal menambahkan pengguna" });
          }
          // Menambahkan id pengguna yang baru dibuat
          const newUser = {
            id: results.insertId, // mendapatkan id yang baru
            name,
            email,
            phone,
            role
          };
          res.status(201).json(newUser); // Mengirimkan data user yang baru dibuat
        }
      );
    } catch (err) {
      res.status(500).json({ error: "Gagal menambahkan pengguna" });
    }
  });
  

// Mengupdate data pengguna
router.put("/:id", async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    const { id } = req.params; // Ambil ID pengguna dari parameter URL
  
    try {
      let updateQuery = "UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?";
      let values = [name, email, phone, role, id];
  
      if (password) {
        // Jika ada password baru, kita perlu melakukan hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery = "UPDATE users SET name = ?, email = ?, phone = ?, password = ?, role = ? WHERE id = ?";
        values = [name, email, phone, hashedPassword, role, id];
      }
  
      db.query(updateQuery, values, (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Gagal mengedit pengguna" });
        }
        res.status(200).json({ message: "Pengguna berhasil diedit" });
      });
    } catch (err) {
      res.status(500).json({ error: "Gagal mengedit pengguna" });
    }
  });
  

// Menghapus pengguna
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal menghapus pengguna" });
    }
    res.json({ message: "Pengguna berhasil dihapus" });
  });
});

module.exports = router;
