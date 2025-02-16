/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
const CreateItem = ({ fetchItems }) => {
  const [name, setName] = useState('');
  // const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/categories', { name });
    fetchItems();
    setName('');
    toast.success("Category added successful!");
   
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-12 bg-white rounded-lg shadow-lg">
      
      <h2 className="text-2xl font-bold text-center mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            required
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItem;
