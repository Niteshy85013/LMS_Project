// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
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
            } catch (error) {
                toast.error("Login Required.");
                navigate("/"); 
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">User Profile</h2>
            {profile ? (
                <div>
                    <div className="mb-4 p-4 border rounded-md bg-gray-100">
                        <p><strong className="text-gray-700">Username:</strong> {profile.username}</p>
                        <p><strong className="text-gray-700">Email:</strong> {profile.email}</p>
                    </div>
                </div>
            ) : (
                <p className="text-center text-red-500">User not found</p>
            )}
        </div>
    );
};

export default Profile;
