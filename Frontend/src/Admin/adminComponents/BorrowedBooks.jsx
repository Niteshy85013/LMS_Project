/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; // For displaying notifications
import { FaTrash } from 'react-icons/fa'; // Trash icon from react-icons

const BorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all borrowed books
    const fetchBorrowedBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/borr/allborrowdata');
            console.log('Fetched Borrowed Books:', response.data); // Log the response data to inspect its structure
            setBorrowedBooks(response.data);
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
            toast.error('Failed to fetch borrowed books.');
        } finally {
            setLoading(false);
        }
    };

    // Handle the delete request
    const handleDelete = async (id) => {
        console.log("Deleting book with ID:", id); // This will help us debug and see if the ID is correct

        if (!id) {
            console.error("No ID provided to delete");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this borrowed book?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/borr/${id}`);
            toast.success("Borrowed book deleted successfully!");
            fetchBorrowedBooks(); // Refresh list after deletion
        } catch (err) {
            console.error("Delete error:", err.response?.data || err.message);
            toast.error("Failed to delete borrowed book.");
        }
    };


    useEffect(() => {
        fetchBorrowedBooks(); // Fetch borrowed books when the component mounts
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Borrowed Books List</h2>

            {loading ? (
                <div className="flex justify-center items-center mt-10">
                    <svg className="w-12 h-12 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            ) : borrowedBooks.length === 0 ? (
                <p className="text-center text-gray-600 mt-10">No Borrowed Books found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-gray-700">Username</th>
                                <th className="px-6 py-3 text-gray-700">Email</th>
                                <th className="px-6 py-3 text-gray-700">Book Title</th>
                                <th className="px-6 py-3 text-gray-700">Book ISBN</th>
                                <th className="px-6 py-3 text-gray-700">Book Author</th>
                                <th className="px-6 py-3 text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map((book) => {
                                console.log("Rendering book:", book); // Debugging step
                                return (
                                    <tr key={book.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm text-gray-800">{book.borrower_username || 'N/A'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-800">{book.borrower_email || 'N/A'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-800">{book.book_title || 'N/A'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-800">{book.book_isbn || 'N/A'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-800">{book.book_author || 'N/A'}</td>

                                        <td className="px-6 py-3 text-sm text-center">
                                            <button
                                                onClick={() => handleDelete(book.id)} // Make sure book.id is correct here
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BorrowedBooks;
