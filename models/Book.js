const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false }, // Validasi tidak boleh kosong [cite: 83]
  author: { type: DataTypes.STRING, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false });

module.exports = Book;