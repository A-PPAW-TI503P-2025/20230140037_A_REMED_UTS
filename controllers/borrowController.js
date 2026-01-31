const Book = require('../models/Book');
const BorrowLog = require('../models/BorrowLog');

exports.borrowBook = async (req, res) => {
  try {
    const { bookId, latitude, longitude } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) return res.status(400).json({ message: "User ID tidak ditemukan di header" });

    const book = await Book.findByPk(bookId);

    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    if (book.stock <= 0) return res.status(400).json({ message: "Maaf, stok buku ini habis" });

    // 1. Kurangi stok
    book.stock -= 1;
    await book.save();

    // 2. Simpan log dengan Geolocation
    const log = await BorrowLog.create({
      userId: parseInt(userId),
      bookId,
      latitude,
      longitude,
      borrowDate: new Date()
    });

    res.status(201).json({ message: "Berhasil meminjam! Stok berkurang.", data: log });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};