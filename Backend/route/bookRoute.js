import express from 'express';
import pool from '../config/db.js';
import authenticateJWT from '../controller/userController.js';
const router = express.Router();

// Create Book
router.post('/', async (req, res) => {
  try {
    const { name, isbn, quantity, description, category_id } = req.body;

    // Insert book into the database
    await pool.query(
      'INSERT INTO books (name, isbn, quantity, description, category_id) VALUES ($1, $2, $3, $4, $5)',
      [name, isbn,quantity, description, category_id]
    );

    res.json({ message: 'Book added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving book' });
  }
});

// Get All Books
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Single Book
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isbn, quantity, description, category_id } = req.body;

    const result = await pool.query(
      'UPDATE books SET name = $1, isbn = $2, quantity = $3, description = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [name, isbn, quantity, description, category_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Borrow a Book
router.post("/books/borrow/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    // Check if the book is available
    const book = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.rows[0].quantity <= 0) {
      return res.status(400).json({ error: "Book is out of stock" });
    }
    // Decrease the book quantity
    await pool.query("UPDATE books SET quantity = quantity - 1 WHERE id = $1", [id]);
    // Add to borrowed books
    await pool.query(
      "INSERT INTO borrowed_books (user_id, book_id) VALUES ($1, $2)",
      [userId, id]
    );

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Return a Book
router.post("/books/return/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the book exists
    const book = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Increase the book quantity
    await pool.query("UPDATE books SET quantity = quantity + 1 WHERE id = $1", [id]);

    // Remove from borrowed books
    await pool.query(
      "DELETE FROM borrowed_books WHERE user_id = $1 AND book_id = $2",
      [userId, id]
    );

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Borrowed Books for Profile Page
router.get("/profile/borrowed-books", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT books.* FROM books JOIN borrowed_books ON books.id = borrowed_books.book_id WHERE borrowed_books.user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
