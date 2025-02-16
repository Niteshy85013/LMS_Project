/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You are not logged in.");
            navigate("/"); // Redirect to login if no token
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data.userProfile);
                setUsername(response.data.userProfile.username);
                setEmail(response.data.userProfile.email);
            } catch (error) {
                toast.error("Login Required.");
                navigate("/"); 
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setUsername(profile.username);
        setEmail(profile.email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                "http://localhost:5000/api/users/updateProfile", 
                { username, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfile(response.data.userProfile);
            toast.success("Profile updated successfully!");
            setEditing(false);
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">User Profile</h2>
            {profile ? (
                <div>
                    <div className="flex items-center space-x-6 mb-4 p-4 border rounded-md bg-gray-100">
                        {/* Avatar Image */}
                        <img
                            src={profile.avatar || "https://www.gravatar.com/avatar/placeholder"}  // Default or user avatar
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full border-2 border-gray-400"
                        />
                        <div>
                            {!editing ? (
                                <>
                                    <p className="text-lg font-semibold text-black"><strong>Username:</strong> {profile.username}</p>
                                    <p className="text-lg font-semibold text-black"><strong>Email:</strong> {profile.email}</p>
                                    <button 
                                        onClick={handleEdit} 
                                        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="username" className="block text-gray-700">Username</label>
                                        <input 
                                            type="text" 
                                            id="username" 
                                            value={username} 
                                            onChange={(e) => setUsername(e.target.value)} 
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-gray-700">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button 
                                            type="button" 
                                            onClick={handleCancel} 
                                            className="p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-red-500">User not found</p>
            )}
        </div>
    );
};

export default Profile;
