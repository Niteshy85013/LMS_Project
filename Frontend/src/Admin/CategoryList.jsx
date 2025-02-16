// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null); // Holds the item being edited
  const [editedName, setEditedName] = useState(""); // Holds the updated name
  // eslint-disable-next-line no-unused-vars
  const [editedDescription, setEditedDescription] = useState(""); // Holds updated description

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`); // Fixed URL
      fetchItems();
      toast.success("Category Deleted!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Open Edit Form
  const handleEditClick = (item) => {
    setEditItem(item);
    setEditedName(item.name);
   
  };

  // Handle Update
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/categories/${editItem.id}`, {
        name: editedName,
         // Ensuring description is updated too
      });
      fetchItems(); // Refresh list after update
      setEditItem(null);
      toast.success("Category Updated successful!"); // Close edit form
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Category List</h2>

      {/* Edit Form - Shown Only When Editing */}
      {editItem && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-lg font-semibold mb-3">Edit Category</h3>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-3"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Category Name"
          />
          
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Update
            </button>
            <button
              onClick={() => setEditItem(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category List Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 border-b text-left">Name</th>
              
              <th className="py-3 px-6 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="py-3 px-6 text-gray-500 border-b">{item.name}</td>
                 
                  <td className="py-3 px-6 border-b text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      <FaEdit className="w-4 h-4" />

                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                     <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No Categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemList;
