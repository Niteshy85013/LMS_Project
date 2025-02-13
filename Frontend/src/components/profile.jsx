import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        return payload.userId; // Ensure backend includes userId in token payload
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    };

    const extractedUserId = getUserIdFromToken();
    if (extractedUserId) {
      setUserId(extractedUserId);
    } else {
      setError("User authentication failed.");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    setLoading(true);

    // Fetch user details
    axios
      .get(`http://localhost:5000/api/users/${userId}`, config)
      .then((response) => {
        setUser(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setError("Failed to load user profile.");
      });

    // Fetch borrowed books
    axios
      .get(`http://localhost:5000/api/users/borrowedbooks/${userId}`, config)
      .then((response) => {
        setBorrowedBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching borrowed books:", error);
        setError("Failed to load borrowed books.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
      {/* User Profile Section */}
      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/80"
          alt="Profile"
          className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
        />
        <div>
          <h2 className="text-2xl font-semibold dark:text-white">{user.username}</h2>
          <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
        </div>
      </div>

      {/* Borrowed Books List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold dark:text-white">Borrowed Books</h3>
        {borrowedBooks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 mt-2">No books borrowed yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {borrowedBooks.map((book) => (
              <li key={book.borrow_id} className="p-3 border rounded-lg dark:border-gray-600 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium dark:text-white">{book.book_name}</h4>
                  <p className="text-gray-500 dark:text-gray-300">By {book.book_isbn}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Borrowed on: {new Date(book.borrow_date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
