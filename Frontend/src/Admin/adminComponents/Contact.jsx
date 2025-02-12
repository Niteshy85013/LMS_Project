import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon
import toast from "react-hot-toast";
const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch contacts
  const fetchContacts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      console.log('Fetched contacts:', response.data); // Log the response data to inspect it
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading once the data is fetched or an error occurs
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle deleting contact
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      fetchContacts(); // Refresh the contact list
      toast.success("Contact deleted successfully!"); // Success toast message
    } catch (error) {
      console.error('Error deleting contact:', error.response ? error.response.data : error.message);
      toast.error("Failed to delete contact. Please try again."); // Error toast message
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Contact List</h2>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <svg className="w-12 h-12 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No contacts found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-gray-700">ID</th>
                <th className="px-6 py-3 text-gray-700">Email</th>
                <th className="px-6 py-3 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-800">{contact.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-800">{contact.email}</td>
                  <td className="px-6 py-3 text-sm text-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <FaTrash className="w-4 h-4" /> {/* Render the trash icon */}
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
