/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Slidebar";
import BooksList from "../BookList";
import CategoryApp from "../CategoryApp";
import Users from "./User";
import Contact from "./Contact";
import BorrowedBooks from "./BorrowedBooks";

const AdminApp = () => { // Changed to PascalCase
  const [activeComponent, setActiveComponent] = useState("Books");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Books":
        return <BooksList />;
      case "Category":
        return <CategoryApp />;
        case "Users":
        return <Users />;
        case "Contact":
        return <Contact />;
        case "BorrowedBooks":
        return <BorrowedBooks />;
      default:
        return <BooksList />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar setActiveComponent={setActiveComponent} />
        <main className="flex-1 bg-gray-100 p-4">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminApp; // Changed to PascalCase