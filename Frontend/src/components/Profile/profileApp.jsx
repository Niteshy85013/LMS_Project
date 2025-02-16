import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Slidebar";
import Profile from "./profile";

const ProfileApp = () => { // Changed to PascalCase
  const [activeComponent, setActiveComponent] = useState("Books");

  const renderComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <Profile />;
        // case "BorrowedBooks":
        // return <BorrowedBooks />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
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