/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import toast from "react-hot-toast";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      fetchContacts();
      toast.success("Contact deleted successfully!");
    } catch (error) {
      console.error('Error deleting contact:', error.response ? error.response.data : error.message);
      toast.error("Failed to delete contact. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📞 Contact List</h2>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No contacts found.</p>
      ) : (
        <div className="overflow-hidden shadow-lg rounded-lg border border-gray-200 bg-white">
          <table className="w-full table-auto text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={contact.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                  <td className="px-6 py-3 text-sm text-gray-800">{contact.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{contact.email}</td>
                  <td className="px-6 py-3 text-sm text-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contact;
