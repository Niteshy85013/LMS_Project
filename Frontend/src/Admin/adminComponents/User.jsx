import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users"); // Adjust API URL if needed
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete a user by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User Deleted!"); // Remove deleted user from state
    } catch (err) {
      alert("Error deleting user");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-blue-500 text-center mb-4">User Management</h2>

      {loading && <p className="text-center">Loading users...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-100">
              <th className="border text-gray-500 p-2">ID</th>
              <th className="border text-gray-500 p-2">Name</th>
              <th className="border text-gray-500  p-2">Email</th>
              <th className="border text-gray-500 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border text-gray-500 p-2">{user.id}</td>
                  <td className="border text-gray-500 p-2">{user.username}</td>
                  <td className="border text-gray-500 p-2">{user.email}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-2 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
