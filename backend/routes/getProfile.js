const express = require("express"); // Import express
const jwt = require("jsonwebtoken");
const { db } = require("../database/db"); // Sesuaikan path ke database Anda
const authenticateToken = require("../middlewares/authMiddlewares");

const router = express.Router(); // Gunakan express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Gunakan variabel lingkungan

// Endpoint untuk mendapatkan profil
router.get("/getProfile", authenticateToken, (req, res) => {
    const userId = req.user.id; // Ambil userId dari token yang sudah diverifikasi

    console.log("User ID dari token:", userId); // Tambahkan log untuk debugging

    db.query(
        "SELECT id, name, email, phone, role FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err) {
                console.error("Error in database query:", err); // Log error query
                return res.status(500).json({ success: false, error: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, error: "User not found" });
            }

            return res.status(200).json({ success: true, user: results[0] });
        }
    );
});

module.exports = router;
