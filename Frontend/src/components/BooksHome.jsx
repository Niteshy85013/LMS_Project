// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
const BooksHome = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // State to hold selected book data

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories'); // Assuming categories endpoint exists
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown'; // Fallback if category not found
  };

  const handleView = (book) => {
    setSelectedBook(book); // Set the selected book to show details
  };

  const handleCloseView = () => {
    setSelectedBook(null); // Close the view
  };

  // Borrow a book

  const borrowBook = async (bookId) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/borr/borrow",
        { book_id: bookId }, // Corrected request body format
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Book Borrowed successfully!");
        fetchBooks(); // Refresh books instead of reloading page
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error("Book Already Borrowed!");
    }
  };

  return (
    <>
      <div className="container mx-auto p-10"></div>
      <div className="container mx-auto p-10">
        {/* View Book Details */}
        {selectedBook && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full flex flex-col md:flex-row items-center md:items-start">

              {/* Left Side - Book Details */}
              <div className="w-full md:w-1/2 p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedBook.name}</h2>
                <p className="text-gray-700"><strong>ISBN:</strong> {selectedBook.isbn}</p>
                <p className="text-gray-700"><strong>Category: </strong> {getCategoryName(selectedBook.category_id)}</p>
                <p className="text-gray-700"><strong>Quantity: </strong> {selectedBook.quantity}</p>
                <p className="text-gray-700"><strong>Author: </strong> {selectedBook.author}</p>
                <p className="text-gray-600 mt-2"><strong>Description: </strong>{selectedBook.description || "No description available"}</p>
                <button
                  onClick={handleCloseView}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>

              {/* Right Side - Book Image */}
              <div className="w-full md:w-1/2 p-4 flex justify-center">
                <img
                  src={"/Banner.png"}  // Ensure this path is correct
                  alt={selectedBook.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

        )}

        {/* Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <div key={book.id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
              {/* Book Image (optional, you can add an image field to the book object if needed) */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4">
                {/* Add book image here if available, for example: */}
                <img src={"../../public/Banner.png"} className="w-full h-full object-cover rounded-lg" />
              </div>

              <h3 className="text-xl font-semibold text-gray-800">{book.name}</h3>
              <p className="text-gray-600 mb-4">ISBN: {book.isbn}</p>
              <p className="text-gray-500 mb-4">Author: {book.author}</p>
              <p className="text-gray-500 mb-4">Quantity: {book.quantity}</p>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleView(book)} // Open the view modal
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  View
                </button>

                {/* Borrow Button */}
                <button
                  onClick={() => borrowBook(book.id)}
                  disabled={book.quantity === 0} // Disable if no stock or already borrowed
                  className={`px-4 py-2 rounded-md transition-colors ${book.quantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                  Borrow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BooksHome;