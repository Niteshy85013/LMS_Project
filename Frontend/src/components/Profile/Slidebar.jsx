import React from "react";

const Sidebar = ({ setActiveComponent }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      {/* w-64 bg-gray-800 text-white p-4 fixed top-0 left-0 h-full z-10 */}
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul>
        <li className="mb-4">
          <button
            onClick={() => setActiveComponent("profile")}
            className="w-full text-left p-2 mt-10 hover:bg-gray-700 rounded"
          >
            Profile
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