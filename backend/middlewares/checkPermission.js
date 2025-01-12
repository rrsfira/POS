const rolePermissions = require('./rolePermissions');

function checkPermission(permission) {
  return (req, res, next) => {
    const userRole = req.user.role; // Asumsikan role pengguna disimpan di req.user
    if (rolePermissions[userRole][permission]) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
}

module.exports = checkPermission;