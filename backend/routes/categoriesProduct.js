const express = require("express");
const router = express.Router();
const { db } = require("../database/db");

// Mendapatkan semua kategori produk
router.get("/", (req, res) => {
  db.query(
    "SELECT id, category_name, category_code FROM Product_Categories",
    (err, results) => {
      if (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({ error: "Gagal mendapatkan kategori produk" });
      }
      res.json(results);
    }
  );
});

// Endpoint untuk menambahkan kategori produk baru
router.post("/", (req, res) => {
  const { category_name, category_code } = req.body;
  if (!category_name || !category_code) {
    return res.status(400).json({ error: "Nama dan kode kategori diperlukan" });
  }

  db.query(
    "INSERT INTO Product_Categories (category_name, category_code) VALUES (?, ?)",
    [category_name, category_code],
    (err, results) => {
      if (err) {
        console.error("Error inserting category:", err);
        return res.status(500).json({ error: "Gagal menambahkan kategori" });
      }
      const newCategory = {
        id: results.insertId,
        category_name,
        category_code,
      };
      res.status(201).json(newCategory);
    }
  );
});

// Mengupdate kategori produk
router.put("/:id", (req, res) => {
  const { category_name, category_code } = req.body;
  const { id } = req.params;

  if (!category_name || !category_code) {
    return res.status(400).json({ error: "Nama dan kode kategori diperlukan" });
  }
  db.query(
    "UPDATE Product_Categories SET category_name = ?, category_code = ? WHERE id = ?",
    [category_name, category_code, id],
    (err) => {
      if (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({ error: "Gagal mengedit kategori" });
      }
      const updatedCategory = { id, category_name, category_code };
      res.json(updatedCategory);
    }
  );  
});

// Menghapus kategori produk
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Product_Categories WHERE id = ?", [id], (err) => {
    if (err) {
      console.error('Error deleting category:', err); 
      return res.status(500).json({ error: "Gagal menghapus kategori" });
    }
    res.json({ message: "Kategori berhasil dihapus" });  // Mengirimkan pesan konfirmasi
  });
});

module.exports = router;
