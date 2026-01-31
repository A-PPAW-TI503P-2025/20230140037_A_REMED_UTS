const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    await Book.update({ stock }, { where: { id: id } });
    res.status(200).json({ message: "Berhasil" }); // Kirim status 200
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.destroy({ where: { id: id } });
    res.json({ message: "Buku berhasil dihapus" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};