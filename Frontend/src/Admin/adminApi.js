import axios from "axios";

const API_URL = "http://localhost:5000/api/users/get"; // Adjust based on your backend server URL

// Get all users
export const getUsers = async (token) => {
    return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

// Delete a user
export const deleteUser = async (id, token) => {
    return axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};
