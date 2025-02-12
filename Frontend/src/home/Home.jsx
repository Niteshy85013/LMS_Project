import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Freebook from "../components/Freebook";
// import BooksHome from "../components/BooksHome";
import Footer from "../components/Footer";


function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Freebook/>
      {/* <BooksHome/> */}
      <Footer/>
    </>
  );
}

export default Home;
