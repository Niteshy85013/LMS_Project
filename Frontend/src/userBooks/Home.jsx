import React from "react";

import BooksHome from "../components/BooksHome";
import Navbaruser from "./nav";
function UserBooks() {
  return (
    <>
      <Navbaruser />
      <div className=" min-h-screen">
        <BooksHome />
      </div>
      
    </>
  );
}

export default UserBooks;
