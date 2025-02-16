// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookForm from './BookForm';
import toast from "react-hot-toast";
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to show/hide the form

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get('http://localhost:5000/api/books');
    setBooks(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('http://localhost:5000/api/categories');
    setCategories(response.data);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowForm(true); // Show the form when editing a book
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/books/${id}`);
    fetchBooks();
    toast.success("Book Deleted!"); 
  };

  const handleFormSubmit = () => {
    setSelectedBook(null); // Close the form after submit
    setShowForm(false); // Hide the form
    fetchBooks(); // Refresh the list
  };

  const handleAddBookClick = () => {
    setSelectedBook(null); // Clear selected book data
    setShowForm(true); // Show the form when "Add Book" is clicked
  };

  const handleCloseForm = () => {
    setShowForm(false); // Close the form when "X" is clicked
  };

  return (
    
    <div className="container mx-auto p-6 mt-10">

      {/* Add Book Button */}
      <button
        onClick={handleAddBookClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-6"
      >
        Add Book
      </button>

      {/* Book Form (Add or Edit) */}
      {showForm && (
        <div className="relative mb-8">
          {/* Close Icon */}
          <button
            onClick={handleCloseForm}
            className="absolute top-0 right-0 text-gray-600 text-2xl p-2"
          >
            &times; {/* This is the "X" close icon */}
          </button>

          {selectedBook ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Book</h2>
              <BookForm book={selectedBook} onFormSubmit={handleFormSubmit} />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Book</h2>
              <BookForm onFormSubmit={handleFormSubmit} />
            </div>
          )}
        </div>
      )}

      {/* Books List in Table Format */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 border-b text-left  font-semibold">Book Name</th>
              <th className="py-2 px-4 border-b text-left  font-semibold">ISBN</th>
              <th className="py-2 px-4 border-b text-left  font-semibold">Author</th>
              <th className="py-2 px-4 border-b text-left  font-semibold">Quantity</th>
              <th className="py-2 px-4 border-b text-left  font-semibold">Category</th>
              <th className="py-2 px-4 border-b text-left  font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="py-2 text-gray-500 px-4">{book.name}</td>
                <td className="py-2 text-gray-500 px-4">{book.isbn}</td>
                <td className="py-2 text-gray-500 px-4">{book.author}</td>
                <td className="py-2 text-gray-500 px-4">{book.quantity}</td>
                <td className="py-2 text-gray-500 px-4">{getCategoryName(book.category_id)}</td>
                <td className="py-2  px-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />

                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksList;
