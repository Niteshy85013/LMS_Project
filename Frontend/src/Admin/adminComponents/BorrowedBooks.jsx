/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa"; // Trash icon from react-icons

const BorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(false);


    // Fetch all borrowed books
    const fetchBorrowedBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/borr/allborrowdata");
            console.log("Fetched Borrowed Books:", response.data);
            setBorrowedBooks(response.data);
        } catch (error) {
            console.error("Error fetching borrowed books:", error);
            toast.error("No borrowed books.");
        } finally {
            setLoading(false);
        }
    };

    // Handle the delete request
    const handleDelete = async (borrowId) => {
        if (!borrowId) {
            console.error("Error: borrowId is undefined");
            return;
        }

        console.log(`Sending DELETE request for borrowId: ${borrowId}`);

        try {
            const response = await axios.delete(`http://localhost:5000/api/borr/borrowed-books/${borrowId}`);
            console.log("Delete response:", response);
            setBorrowedBooks(borrowedBooks.filter(book => book.id !== borrowId)); // Remove book from UI
            toast.success('Borrowed book deleted successfully!');
        } catch (error) {
            console.error('Error deleting borrowed book:', error);
            toast.error('Failed to delete borrowed book');
        }
    };
    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    return (
        <div className="max-w-5xl mx-auto mt-10 p-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">📚 Borrowed Books</h2>

            {loading ? (
                <div className="flex justify-center items-center mt-10">
                    <svg className="w-12 h-12 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            ) : borrowedBooks.length === 0 ? (
                <p className="text-center text-gray-600 mt-10">No Borrowed Books found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border rounded-lg shadow-md">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">Username</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Book Title</th>
                                <th className="px-4 py-3 text-left">Book ISBN</th>
                                <th className="px-4 py-3 text-left">Book Author</th>
                                {/* <th className="px-4 py-3 text-center">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map((book, index) => (
                                <tr
                                    key={book.id}
                                    className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
                                >
                                    <td className="px-4 py-3 text-gray-800">{book.borrower_username || "N/A"}</td>
                                    <td className="px-4 py-3 text-gray-800">{book.borrower_email || "N/A"}</td>
                                    <td className="px-4 py-3 text-gray-800">{book.book_title || "N/A"}</td>
                                    <td className="px-4 py-3 text-gray-800">{book.book_isbn || "N/A"}</td>
                                    <td className="px-4 py-3 text-gray-800">{book.book_author || "N/A"}</td>

                                    {/* <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(book.id)}  // ✅ Corrected here
                                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </td> */}
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
