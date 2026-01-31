const express = require('express');
const path = require('path'); 
const cors = require('cors'); // Pindahkan ke atas
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');

// 1. BUAT APP DULU
const app = express(); 

// 2. BARU GUNAKAN MIDDLEWARE
app.use(cors()); // Sekarang ini tidak akan error lagi
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DATABASE SYNC
const Book = require('./models/Book');
const BorrowLog = require('./models/BorrowLog');

sequelize.sync({ alter: true })
  .then(() => console.log('Database & Tabel berhasil disinkronkan'))
  .catch(err => console.error('Gagal koneksi database: ' + err));

// ROUTES
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});