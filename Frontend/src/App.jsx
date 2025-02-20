// eslint-disable-next-line no-unused-vars
import React from "react";
import Home from "./home/Home";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import CategoryApp from "./Admin/CategoryApp";
import BooksList from "./Admin/BookList";
import BooksHome from "./components/BooksHome";
import AdminApp from "./Admin/adminComponents/adminApp";
import UserBooks from "./userBooks/Home";
import ProfileApp from "./components/Profile/profileApp";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/b" element={<BooksHome />} />
          <Route path="/category" element={<CategoryApp/>} />
          {/* <Route
            path="/course"
            // element={authUser ? <Courses /> : <Navigate to="/signup" />}
            
          /> */}
          <Route path="/admin" element={<AdminApp/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books" element={<BooksList/>} />
          <Route path="/userbook" element={ <UserBooks/> } />
          <Route path="/profile" element={<ProfileApp/>} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
