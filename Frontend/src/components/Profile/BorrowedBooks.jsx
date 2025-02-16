// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BorrowedBoo = () => {
    const [profile, setProfile] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You are not logged in.");
            navigate("/"); 
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data.userProfile);
                setBorrowedBooks(response.data.borrowedBooks); // Set borrowed books data
            } catch (error) {
                toast.error("Login Required.");
                navigate("/"); // Redirect to login if error
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleReturnBook = (bookId) => {
        // Logic to return a borrowed book, e.g., sending a request to your backend
        axios.post("http://localhost:5000/api/return/return-book", { bookId })
            // eslint-disable-next-line no-unused-vars
            .then(response => {
                toast.success("Book returned successfully!");
                setBorrowedBooks(borrowedBooks.filter(book => book.id !== bookId)); // Update the UI
            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => {
                toast.error("Failed to return the book.");
            });
    };

    if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Borrowed Books</h2>
            {profile ? (
                <div>
                    <h3 className="text-xl font-semibold mt-6 text-gray-700">Borrowed Books List</h3>
                    {borrowedBooks.length === 0 ? (
                        <p className="text-gray-500 mt-2">No books borrowed.</p>
                    ) : (
                        <ul className="mt-4 space-y-4">
                            {borrowedBooks.map((book) => (
                                <li key={book.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-lg font-medium text-gray-800">{book.name}</p>
                                            <p className="text-gray-600"><strong>Author:</strong> {book.author}</p>
                                            <p className="text-gray-600"><strong>ISBN:</strong> {book.isbn}</p>
                                            <p className="text-gray-500 text-sm">
                                                <strong>Borrow Date:</strong> {new Date(book.borrowed_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleReturnBook(book.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-600 transition-colors mt-4 md:mt-0"
                                        >
                                            Return
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <p className="text-center text-red-500">User not found</p>
            )}
        </div>
    );
};

export default BorrowedBoo;
