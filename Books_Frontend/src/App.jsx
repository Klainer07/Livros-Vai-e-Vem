import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";
import AddBookPage from "./pages/AddBookPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/add">Add Book</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookPage />} />
        <Route path="/add" element={<AddBookPage />} />
      </Routes>
    </div>
  );
}

export default App;
