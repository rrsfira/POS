const express = require("express");
const multer = require("multer");
const path = require("path");
const { db } = require("../database/db"); 
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product/"); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

// Multer file filter for image validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, or .png files are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

// Route: Create Product
router.post("/", upload.single("product_image"), (req, res) => {
  const {
    product_name,
    product_description,
    unit_price,
    category_id,
    brand_id,
    barcode,
    cost,
    stockAlert,
    unit_id,
    order_tax,
  } = req.body;
  const product_image = req.file ? req.file.filename : null;

  const sqlQuery = `
    INSERT INTO products 
    (product_name, product_description, unit_price, category_id, brand_id, barcode, cost, stockAlert, unit_id, order_tax, product_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sqlQuery,
    [
      product_name,
      product_description,
      parseFloat(unit_price),
      parseInt(category_id),
      parseInt(brand_id),
      barcode,
      parseFloat(cost),
      parseInt(stockAlert),
      unit_id,
      parseFloat(order_tax), 
      product_image,
    ],
    (err, results) => {
      if (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({ error: "Failed to create product." });
      }
      res.status(201).json({
        id: results.insertId,
        product_name,
        order_tax, 
        product_image,
      });
    }
  );
});
  
// Route: Get All Products
router.get("/", (req, res) => {
  const query = `
    SELECT 
      p.id,
      p.product_name,
      p.barcode,
      b.brand_name,
      c.category_name,
      p.cost,
      p.unit_price,
      p.stockAlert,
      u.short_name,
      p.product_image
    FROM 
      products p
    LEFT JOIN 
      product_brands b ON p.brand_id = b.id
    LEFT JOIN 
      product_categories c ON p.category_id = c.id
    LEFT JOIN
      product_units u ON p.unit_id = u.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Failed to fetch products." });
    }
    res.json(results);
  });
});

// Route: Get Product By ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Query untuk mengambil data produk beserta brand, category, unit, dan gambar produk
  const query = `
    SELECT 
      p.id,
      p.product_name,
      p.barcode,
      b.brand_name,
      c.category_name,
      p.cost,
      p.unit_price,
      p.stockAlert,
      u.name,
      p.product_image
    FROM 
      products p
    LEFT JOIN 
      product_brands b ON p.brand_id = b.id
    LEFT JOIN 
      product_categories c ON p.category_id = c.id
    LEFT JOIN
      product_units u ON p.unit_id = u.id
    WHERE p.id = ?`;

  // Eksekusi query
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product." });
    }
    if (!results.length) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(results[0]); // Kirim data produk yang ditemukan
  });
});


// Route: Update Product
// Route: Update Product
router.put("/:id", upload.single("product_image"), (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    product_description,
    unit_price,
    category_id,
    brand_id,
    barcode,
    cost,
    stockAlert,
    unit_id,
    order_tax,
  } = req.body;

  const product_image = req.file ? req.file.filename : null;

  const sqlQuery = `
    UPDATE products
    SET 
      product_name = ?, 
      product_description = ?, 
      unit_price = ?, 
      category_id = ?, 
      brand_id = ?, 
      barcode = ?, 
      cost = ?, 
      stockAlert = ?, 
      unit_id = ?, 
      order_tax = ?, 
      product_image = COALESCE(?, product_image)
    WHERE id = ?
  `;

  db.query(
    sqlQuery,
    [
      product_name,
      product_description,
      parseFloat(unit_price),
      parseInt(category_id),
      parseInt(brand_id),
      barcode,
      parseFloat(cost),
      parseInt(stockAlert),
      unit_id,
      parseFloat(order_tax),
      product_image,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ message: "Failed to update product." });
      }
      res.status(200).json({ message: "Product updated successfully." });
    }
  );
});

// Route: Delete Product
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ message: "Failed to delete product." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  });
});

module.exports = router;
