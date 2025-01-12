const express = require("express");
const router = express.Router();
const { db } = require("../database/db");

// Mendapatkan semua unit
router.get('/', (req, res) => {
  db.query('SELECT * FROM product_units', (err, results) => {
    if (err) {
      console.error('Error fetching units:', err);
      return res.status(500).json({ error: 'Gagal mendapatkan unit' });
    }
    res.json(results);
  });
});

// Menambahkan unit baru
router.post('/', async (req, res) => {
  try {
    const { name, short_name, operator, value } = req.body;

    // Validasi data (misalnya cek jika nilai kosong)
    if (!name || !short_name || !value) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Proses menyimpan data ke database
    const query = 'INSERT INTO product_units (name, short_name, operator, value) VALUES (?, ?, ?, ?)';
    db.query(query, [name, short_name, operator, value], (err, result) => {
      if (err) {
        console.error('Error adding unit:', err);
        return res.status(500).json({ message: "Failed to add unit" });
      }
      // Kirimkan respon dengan ID dari unit baru
      res.status(201).json({
        id: result.insertId,
        name,
        short_name,
        operator,
        value,
      });
    });
  } catch (error) {
    console.error("Error occurred during adding unit:", error);  // Log error yang terjadi
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Mengupdate unit
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, short_name, operator, value } = req.body;

  if (!name || !short_name || !operator || !value) {
    return res.status(400).json({ error: 'Semua field harus diisi' });
  }

  const query = 'UPDATE product_units SET name = ?, short_name = ?, operator = ?, value = ? WHERE id = ?';
  db.query(query, [name, short_name, operator, value, id], (err) => {
    if (err) {
      console.error('Error updating unit:', err);
      return res.status(500).json({ error: 'Gagal mengupdate unit' });
    }
    res.json({ id, name, short_name, operator, value });
  });
});

// Menghapus unit
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM product_units WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting unit:', err);
      return res.status(500).json({ error: 'Gagal menghapus unit' });
    }
    res.json({ message: 'Unit berhasil dihapus' });
  });
});

module.exports = router;
