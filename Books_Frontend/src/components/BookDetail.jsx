import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/books";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setBook(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (!book) return <p>Loading book...</p>;

  return (
    <div>
      <h2>{book.title}</h2>
      <p><strong>Description:</strong> {book.description || "N/A"}</p>
      <p><strong>Page Count:</strong> {book.pageCount}</p>
      <p><strong>Excerpt:</strong> {book.excerpt || "N/A"}</p>
      <p><strong>Publish Date:</strong> {book.publishDate}</p>
      <button onClick={deleteBook}>Delete Book</button>
    </div>
  );
}

export default BookDetail;
