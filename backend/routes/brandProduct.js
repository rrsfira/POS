const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {db} = require("../database/db");

// Konfigurasi penyimpanan file dengan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/brand/"); // Direktori tempat file akan disimpan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

// Filter jenis file (hanya jpg, jpeg, dan png)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file dengan format .jpg, .jpeg, atau .png yang diizinkan!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Mendapatkan semua merek produk
router.get("/", (req, res) => {
  db.query(
    "SELECT id, brand_code, brand_name, brand_description, brand_image FROM product_brands",
    (err, results) => {
      if (err) {
        console.error("Error fetching brands:", err);
        return res.status(500).json({ error: "Gagal mendapatkan merek produk" });
      }
      res.json(results);
    }
  );
});

// Menambahkan merek produk baru dengan gambar
router.post("/", upload.single("brand_image"), (req, res) => {
    const { brand_code, brand_name, brand_description } = req.body;
    const brand_image = req.file ? req.file.filename : null;
  
    if (!brand_code || !brand_name) {
      return res.status(400).json({ error: "Kode dan nama merek diperlukan" });
    }
  
    db.query(
      "INSERT INTO product_brands (brand_code, brand_name, brand_description, brand_image) VALUES (?, ?, ?, ?)",
      [brand_code, brand_name, brand_description, brand_image],
      (err, results) => {
        if (err) {
          console.error("Error inserting brand:", err);
          return res.status(500).json({ error: "Gagal menambahkan merek" });
        }
        res.status(201).json({
          id: results.insertId,
          brand_code,
          brand_name,
          brand_description,
          brand_image,
        });
      }
    );
  });
  
// Mengupdate merek produk dengan gambar
router.put("/:id", upload.single("brand_image"), (req, res) => {
  const { brand_code, brand_name, brand_description } = req.body;
  const { id } = req.params;
  const brand_image = req.file ? req.file.filename : null;

  if (!brand_code || !brand_name) {
    return res.status(400).json({ error: "Kode dan nama merek diperlukan" });
  }

  const query = brand_image
    ? "UPDATE product_brands SET brand_code = ?, brand_name = ?, brand_description = ?, brand_image = ? WHERE id = ?"
    : "UPDATE product_brands SET brand_code = ?, brand_name = ?, brand_description = ? WHERE id = ?";
  const params = brand_image
    ? [brand_code, brand_name, brand_description, brand_image, id]
    : [brand_code, brand_name, brand_description, id];

  db.query(query, params, (err) => {
    if (err) {
      console.error("Error updating brand:", err);
      return res.status(500).json({ error: "Gagal mengedit merek" });
    }
    const updatedBrand = {
      id,
      brand_code,
      brand_name,
      brand_description,
      brand_image,
    };
    res.json(updatedBrand);
  });
});

// Menghapus merek produk
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM product_brands WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting brand:", err);
      return res.status(500).json({ error: "Gagal menghapus merek" });
    }
    res.json({ message: "Merek berhasil dihapus" });
  });
});

module.exports = router;
