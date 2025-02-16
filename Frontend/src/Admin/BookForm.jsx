/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
const BookForm = ({ book, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    isbn: '',
    author: '',
    quantity: '',
    description: '',
    category_id: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    };
    fetchCategories();

    if (book) {
      setFormData({
        name: book.name,
        isbn: book.isbn,
        author: book.author,
        quantity: book.quantity,
        description: book.description,
        category_id: book.category_id,
      });
      
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      quantity: Number(formData.quantity), // Ensure quantity is a number
    };
    console.log('Data to Send:', dataToSend); // Debugging: Log data being sent
    if (book) {
      // Update book
      await axios.put(`http://localhost:5000/api/books/${book.id}`, dataToSend);
      toast.success("Book updated successful!");
    } else {
      // Create new book
      await axios.post('http://localhost:5000/api/books', dataToSend);
      toast.success("Book added successful!");
    }
    onFormSubmit();
    
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-700">{book ? 'Update Book' : 'Add New Book'}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-2">Book Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter book name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">ISBN</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter Author"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter Quantity"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter book description"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
        >
          {book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;