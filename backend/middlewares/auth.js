// middlewares/auth.js
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
      return res.status(401).json({ error: 'Silakan login terlebih dahulu' });
  }
  next(); // Melanjutkan ke rute berikutnya
}

module.exports = isAuthenticated;
