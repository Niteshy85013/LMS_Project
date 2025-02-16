// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Sidebar from "./Slidebar";
import Profile from "./profile";
import BorrowedBoo from "./BorrowedBooks";
import Navbaruser from "../../userBooks/nav";

const ProfileApp = () => { // Changed to PascalCase
  const [activeComponent, setActiveComponent] = useState("Books");

  const renderComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <Profile />;
        case "BorrowedBooks":
        return <BorrowedBoo/>;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
   <Navbaruser/>
      <div className="flex flex-1">
        <Sidebar setActiveComponent={setActiveComponent} />
        <main className="flex-1 bg-gray-100 p-4">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default ProfileApp; // Changed to PascalCase