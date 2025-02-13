import express from "express";
import authenticateJWT from "../controller/userController.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();
// User Registration
router.post("/", async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const result = await pool.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, email]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // User Login
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  
      if (!result || result.rows.length === 0) {
        console.log("User not found");
        return res.status(400).json({ error: "Invalid username or password" });
      }
  
      const user = result.rows[0];
      console.log("User found:", user);
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log("Invalid password");
        return res.status(400).json({ error: "Invalid username or password" });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "12h" });
  
      res.status(200).json({ token });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// **Get All Users**
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// **Delete User by ID**
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Get user profile by ID
// router.get('/:id', async (req, res) => {
//   let { id } = req.params;

//   // Ensure ID is an integer
//   id = parseInt(id, 10);
//   if (isNaN(id)) {
//     return res.status(400).json({ error: 'Invalid user ID' });
//   }

//   try {
//     const query = `SELECT id, username, email FROM users WHERE id = $1`;
//     const result = await pool.query(query, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error fetching user profile:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Get profile information by user ID
router.get('/profile/:Id', async (req, res) => {
  const { Id } = req.params;

  try {
    // Get user information
    const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [Id]);
    if (userQuery.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userQuery.rows[0];

    // Get borrowed books by the user
    const borrowedBooksQuery = await pool.query(
      'SELECT b.name as book_name, b.isbn as isbn, bb.borrowed_at FROM borrowed_books AS bb JOIN books AS b ON bb.book_id = b.id WHERE bb.user_id = $1',
      [Id]
    );

    // Send a structured response
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email, // Include other relevant fields as needed
      },
      borrowedBooks: borrowedBooksQuery.rows
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




export default router;