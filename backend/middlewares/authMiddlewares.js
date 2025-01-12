const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Ambil token setelah "Bearer"

    if (!token) {
        return res.status(401).json({ success: false, error: "Token tidak ditemukan" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key"); // Pastikan JWT_SECRET sesuai
        req.user = decoded; // Simpan decoded token ke req.user
        next(); // Lanjut ke handler berikutnya
    } catch (err) {
        console.error("Error verifying token:", err);
        return res.status(403).json({ success: false, error: "Token tidak valid" });
    }
}

module.exports = authenticateToken;
