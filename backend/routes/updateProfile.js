const express = require('express');
const { db } = require('../database/db');
const isAuthenticated = require('../middlewares/auth'); // Mengimpor middleware
const router = express.Router();

router.put('/updateProfile', isAuthenticated, async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    const userId = req.session.user.id; // Mendapatkan ID pengguna dari sesi

    let updateQuery = "UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?";
    let values = [name, email, phone, role, userId];

    if (password) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery = "UPDATE users SET name = ?, email = ?, phone = ?, password = ?, role = ? WHERE id = ?";
        values = [name, email, phone, hashedPassword, role, userId];
    }

    db.query(updateQuery, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal memperbarui profil' });
        }
        res.status(200).json({ message: 'Profil berhasil diperbarui' });
    });
});

module.exports = router;
