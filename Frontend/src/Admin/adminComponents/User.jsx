import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get userId from localStorage (assumed to be saved when user logs in)
  const Id = localStorage.getItem('userId');  // Ensure userId is set in localStorage

  // Fetch profile and borrowed books data
  const fetchProfileData = async () => {
    if (!Id) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${Id}`);
      setProfile(response.data); // Set profile data
      setLoading(false);          // Stop loading
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);          // Stop loading even if there is an error
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [Id]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message until data is loaded
  }

  if (error) {
    return <div>{error}</div>; // Display error if fetching fails
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>

      {profile && (
        <div>
          <div className="mb-4">
            <h3 className="font-bold text-lg">Name: {profile.user.username}</h3>
            <p>Email: {profile.user.email}</p>
          </div>

          <h3 className="font-semibold text-lg mt-6">Borrowed Books</h3>

          {profile.borrowedBooks.length === 0 ? (
            <p>No borrowed books found.</p>
          ) : (
            <ul className="list-disc ml-5">
              {profile.borrowedBooks.map((book) => (
                <li key={book.isbn} className="mb-2">
                  <strong>{book.book_name}</strong> (ISBN: {book.isbn})
                  <br />
                  Borrowed on: {new Date(book.borrowed_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
