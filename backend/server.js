const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require('path');
const app = express();
const port = 5000;

// Import routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const usersRoute = require("./routes/users");
const updateProfileRoute = require("./routes/updateProfile");
const categoriesProductRoute = require("./routes/categoriesProduct");
const brandProductsRoute = require("./routes/brandProduct");
const unitProductRoute = require("./routes/unitProduct")
const productsRoute = require("./routes/products")

app.use(cors());
app.use(express.json());
app.use('/uploads/brand', express.static(path.join(__dirname, 'uploads/brand')));
app.use('/uploads/product', express.static(path.join(__dirname, 'uploads/product')));

// Menggunakan express-session untuk menyimpan sesi pengguna
app.use(session({
    secret: 'your_secret_key', // Secret key untuk mengenkripsi sesi
    resave: false, // Jangan menyimpan sesi jika tidak ada perubahan
    saveUninitialized: true, // Menyimpan sesi meskipun belum ada data
    cookie: { secure: false } // Setel ke true jika menggunakan HTTPS
}));

// Menambahkan rute API
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", logoutRoute);
app.use("/api/users", usersRoute);
app.use("/api", updateProfileRoute);
app.use("/api/categories", categoriesProductRoute);
app.use("/api/brands", brandProductsRoute); 
app.use("/api/units", unitProductRoute);
app.use("/api/products" , productsRoute);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
