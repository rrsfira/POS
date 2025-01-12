const express = require('express');
const router = express.Router();

// Jika menggunakan sesi
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to logout' });
        }
        res.clearCookie('connect.sid'); // Menghapus cookie sesi
        res.status(200).send({ message: 'Logout successful' });
    });
});

module.exports = router;
