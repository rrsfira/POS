app.get('/api/people', (req, res) => {
    const userRole = req.user.role;
    if (userRole === 'Admin') {
      // Kembalikan semua data people
    } else if (userRole === 'Manager' || userRole === 'Cashier') {
      // Kembalikan sebagian data people
    }
  });