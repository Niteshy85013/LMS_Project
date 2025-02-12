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

// Borrow Book
import jwt from "jsonwebtoken";

router.post("/borrow", async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Decode user ID from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id; // Ensure 'id' exists in your token payload
    const { book_id } = req.body;

    if (!book_id) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Check if book is available
    const bookData = await pool.query("SELECT quantity FROM books WHERE id = $1", [book_id]);

    if (bookData.rowCount === 0 || bookData.rows[0].quantity <= 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ error: "Book not available" });
    }

    // Reduce book quantity by 1
    await pool.query("UPDATE books SET quantity = quantity - 1 WHERE id = $1", [book_id]);

    // Insert into borrowed_books
    await pool.query(
      "INSERT INTO borrowed_books (user_id, book_id, borrowed_at) VALUES ($1, $2, NOW())",
      [user_id, book_id]
    );

    // Commit transaction
    await pool.query("COMMIT");

    res.json({ message: "Book borrowed successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error borrowing book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Return Book
// router.post("/return", async (req, res) => {
//   const { user_id, book_id } = req.body;

//   await pool.query("UPDATE books SET quantity = quantity + 1 WHERE id = $1", [book_id]);
//   await pool.query("DELETE FROM borrowed_books WHERE user_id = $1 AND book_id = $2", [user_id, book_id]);

//   res.json({ message: "Book returned successfully" });
// });

router.post("/return", async (req, res) => {
  const { user_id, book_id } = req.body;

  // Validate required inputs
  if (!user_id || !book_id) {
    return res.status(400).json({ error: "Missing user_id or book_id" });
  }

  try {
    // Start transaction
    await pool.query("BEGIN");

    // Fetch current quantity and total quantity from books table
    const bookData = await pool.query(
      "SELECT quantity, total_quantity FROM books WHERE id = $1",
      [book_id]
    );

    if (bookData.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Book not found" });
    }

    const { quantity, total_quantity } = bookData.rows[0];

    // Check if the user actually borrowed the book
    const borrowedBook = await pool.query(
      "SELECT * FROM borrowed_books WHERE user_id = $1 AND book_id = $2",
      [user_id, book_id]
    );

    if (borrowedBook.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ error: "No borrowed record found for this user" });
    }

    // Update book quantity only if it does not exceed the total quantity
    if (quantity < total_quantity) {
      await pool.query(
        "UPDATE books SET quantity = quantity + 1 WHERE id = $1",
        [book_id]
      );
    }

    // Remove the borrowed record
    await pool.query(
      "DELETE FROM borrowed_books WHERE user_id = $1 AND book_id = $2",
      [user_id, book_id]
    );

    // Commit transaction
    await pool.query("COMMIT");

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    // Rollback on error
    console.error("Error returning book:", error.stack);
    await pool.query("ROLLBACK");
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
