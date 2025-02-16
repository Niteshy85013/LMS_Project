/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios"; // Don't forget to import axios
import banner from "../../public/Banner.png"; // Ensure the path to your banner image is correct
import toast from "react-hot-toast";
function Banner() {
  const [email, setEmail] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/contacts', { email });
      setEmail('');
      toast.success("Contact Send successfully!");
       // Clear the email input after submitting
      // You can implement fetchContacts() to reload the contact list if needed
    } catch (error) {
      console.error('Error submitting contact:', error);
    }
  };

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10">
        <div className="w-full order-2 md:order-1 md:w-1/2 mt-12 md:mt-36">
          <div className="space-y-8">
            <h1 className="text-2xl md:text-4xl font-bold">
              Hello, welcome to library management system{" "}
              <span className="text-pink-500">new everyday!!!</span>
            </h1>
            <p className="text-sm md:text-xl">
              "E-Library Management System – Read, Learn, and Explore Anytime, Anywhere!"
            </p>

            {/* Contact Form */}
            <form onSubmit={handleSubmit}>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="email" // Use email type for validation
                  className="grow"
                  placeholder="Email"
                  value={email} // Controlled input
                  onChange={(e) => setEmail(e.target.value)} // Update state
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
              </label>
              <button
                type="submit"
                className="btn mt-6 btn-secondary"
              >
                Contact Now
              </button>
            </form>
          </div>
        </div>
        <div className="order-1 w-full mt-20 md:w-1/2">
          {/* Update path if necessary */}
          <img
            src={banner} // Use the correct image import
            alt="home"
            className="md:w-[550px] md:h-[460px] md:ml-12"
          />
        </div>
      </div>

      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-orange-500 mb-6">Book Lists</h1>
        {/* Other content like book lists will go here */}
      </div>
    </>
  );
}

export default Banner;
