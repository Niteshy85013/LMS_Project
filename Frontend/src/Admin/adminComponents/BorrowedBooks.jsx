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

    // Handle delete of a borrowed book using its `id`
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/borr/b/${id}`); // Correct URL for deleting borrowed book by id
            fetchBorrowedBooks(); // Refresh the borrowed books list
            toast.success("Borrowed Book deleted!"); // Success toast message
        } catch (error) {
            console.error('Error deleting Borrowed Book:', error.response ? error.response.data : error.message);
            toast.error("Failed to delete Borrowed Book. Please try again."); // Error toast message
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
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
                    <table className="w-full table-auto text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-gray-700">Username</th>
                                <th className="px-6 py-3 text-gray-700">Email</th>
                                <th className="px-6 py-3 text-gray-700">Book Title</th>
                                <th className="px-6 py-3 text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map((book) => (
                                <tr key={book.id} className="border-b hover:bg-gray-50"> {/* Using book.id for key */}
                                    <td className="px-6 py-3 text-sm text-gray-800">{book.borrower_username || 'N/A'}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{book.borrower_email || 'N/A'}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{book.book_title || 'N/A'}</td>

                                    <td className="px-6 py-3 text-sm text-center">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                                            onClick={() => handleDelete(book.id)} // Corrected: Use book.id for deletion
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

export default BorrowedBooks;
