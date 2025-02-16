/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Sidebar = ({ setActiveComponent }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      {/* w-64 bg-gray-800 text-white p-4 fixed top-0 left-0 h-full z-10 */}
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul>
        <li className="mb-4">
          <button
            onClick={() => setActiveComponent("Books")}
            className="w-full text-left p-2 mt-10 hover:bg-gray-700 rounded"
          >
            Books
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => setActiveComponent("Category")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            Category
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => setActiveComponent("Users")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            Users
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => setActiveComponent("Contact")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            Contacts
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => setActiveComponent("BorrowedBooks")}
            className="w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            Borrowed Books
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;