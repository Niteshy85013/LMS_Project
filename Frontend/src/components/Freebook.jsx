// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

function Freebook() {
  const [books, setBooks] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/books"),
        axios.get("http://localhost:5000/api/categories"),
      ]);
      setBooks(booksResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (book) => setSelectedBook(book);
  const handleCloseView = () => setSelectedBook(null);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // Display 4 cards per slide
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <h1 className="font-semibold text-xl pb-4">Free Books</h1>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full flex flex-col md:flex-row items-center md:items-start">

            {/* Left Side - Book Details */}
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedBook.name}</h2>
              <p className="text-gray-700"><strong>ISBN:</strong> {selectedBook.isbn}</p>
              <p className="text-gray-700"><strong>Author:</strong> {selectedBook.author}</p>
              <p className="text-gray-700"><strong>Quantity:</strong> {selectedBook.quantity}</p>
              <p className="text-gray-700 mt-2"><strong>Description:</strong>{selectedBook.description || "No description available"}</p>
              <button
                onClick={handleCloseView}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>

            {/* Right Side - Book Image */}
            <div className="w-full md:w-1/2 p-4 flex justify-center">
              <img
                src={"/Book.png"}  // Ensure this path is correct
                alt={selectedBook.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

      )}

      {/* Book Slider */}
      {books.length > 0 ? (
        <Slider {...sliderSettings}>
          {books.map((book) => (
            <div key={book.id} className="p-4">
              <div className="bg-white rounded-lg shadow-lg p-4 transform hover:scale-105 transition duration-200">
                <img
                  src={"../../public/Banner.png"}
                  alt={book.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h2 className="text-gray-500 text-sm">{book.name}</h2>
                  <p className="text-gray-500 text-sm"><strong>By: </strong> {book.author}</p>

                  <button
                    onClick={() => handleView(book)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center text-gray-500">No free books available.</div>
      )}
    </div>
  );
}

export default Freebook;
