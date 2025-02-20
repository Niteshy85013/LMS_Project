/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import bookss from "../../public/Book2.png";

const BooksHome = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookData, setBorrowedBooks] = useState(new Set());

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const handleView = (book) => setSelectedBook(book);
  const handleCloseView = () => setSelectedBook(null);

  const borrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/borr/borrow",
        { book_id: bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Book Borrowed successfully!");
        setBorrowedBooks((prev) => new Set(prev).add(bookId));
        fetchBooks();
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error("Book Already Borrowed!");
    }
  };

  return (
    <div className="container mx-auto p-10 mt-10">
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedBook.name}</h2>
              <p className="text-gray-700"><strong>ISBN:</strong> {selectedBook.isbn}</p>
              <p className="text-gray-700"><strong>Category:</strong> {getCategoryName(selectedBook.category_id)}</p>
              <p className="text-gray-700"><strong>Quantity:</strong> {selectedBook.quantity}</p>
              <p className="text-gray-700"><strong>Author:</strong> {selectedBook.author}</p>
              <p className="text-gray-600 mt-2"><strong>Description:</strong> {selectedBook.description || "No description available"}</p>
              <button onClick={handleCloseView} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                Close
              </button>
            </div>
            <div className="w-full md:w-1/2 p-4 flex justify-center">
              <img src={bookss} alt={selectedBook.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <div key={book.id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4">
              <img src={bookss} alt="Book" className="w-full h-[200px] object-cover rounded-lg" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{book.name}</h3>
            <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
            <p className="text-gray-500 mb-2">Author: {book.author}</p>
            <p className="text-gray-500 mb-2">Quantity: {book.quantity}</p>

            <div className="flex space-x-4 mt-4">
              <button onClick={() => handleView(book)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                View
              </button>
              <button
                onClick={() => borrowBook(book.id)}
                disabled={bookData.has(book.id) || book.quantity === 0}
                className={`px-4 py-2 rounded-md text-white transition ${
                  bookData.has(book.id) || book.quantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {bookData.has(book.id) ? "Borrowed" : "Borrow"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksHome;
