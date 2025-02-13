import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        username: data.username, // Ensure backend accepts 'username' or change to 'email'
        password: data.password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");
      navigate("/userbook");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid username or password");
    }
  };

  // Function to close the modal
  const closeModal = () => {
    document.getElementById("my_modal_3").close();
  };

  return (
    <div>
      {/* Button to Open Modal */}
      {/* <button
        className="btn btn-primary"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        Open Login
      </button> */}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit(handleLogin)} method="dialog">
            {/* Close Button */}
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal} // Close the modal on click
            >
              ✕
            </button>

            <h3 className="font-bold text-lg">Login</h3>

            {/* Username Input */}
            <div className="mt-4 space-y-2">
              <span>Username</span>
              <br />
              <input
                type="text"
                placeholder="Enter your username"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <span className="text-sm text-red-500">{errors.username.message}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="mt-4 space-y-2">
              <span>Password</span>
              <br />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* Login Button & Signup Link */}
            <div className="flex justify-around mt-6">
              <button
                type="submit"
                className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200"
              >
                Login
              </button>
              <p>
                Not registered?{" "}
                <Link to="/signup" className="underline text-blue-500 cursor-pointer">
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
