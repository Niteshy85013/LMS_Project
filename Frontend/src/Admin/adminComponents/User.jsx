import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaTrash } from 'react-icons/fa';
const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users from the backend
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users"); // Adjust the API endpoint if necessary
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // Handle deleting a user
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`); // Adjust the API endpoint if necessary
            setUsers(users.filter((user) => user.id !== id));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold text-gray-600">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4 p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">User List</h2>

            {users.length === 0 ? (
                <p className="text-lg text-gray-600">No users found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
                    <table className="w-full table-auto text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-gray-700 text-sm font-medium">ID</th>
                                <th className="px-6 py-3 text-gray-700 text-sm font-medium">Username</th>
                                <th className="px-6 py-3 text-gray-700 text-sm font-medium">Email</th>
                                <th className="px-6 py-3 text-gray-700 text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-3 text-sm text-gray-800">{user.id}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{user.username}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{user.email}</td>
                                    <td className="px-6 py-3 text-sm text-center">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                            onClick={() => handleDelete(user.id)}
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

export default Users;
