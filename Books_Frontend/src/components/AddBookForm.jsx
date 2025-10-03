import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/books";

function AddBookForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    pageCount: "",
    excerpt: "",
    publishDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { 
        ...form, 
        pageCount: parseInt(form.pageCount) 
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Book</h2>
      <div>
        <label>Title:</label>
        <input name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
      </div>
      <div>
        <label>Page Count:</label>
        <input type="number" name="pageCount" value={form.pageCount} onChange={handleChange} required />
      </div>
      <div>
        <label>Excerpt:</label>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} />
      </div>
      <div>
        <label>Publish Date:</label>
        <input type="date" name="publishDate" value={form.publishDate} onChange={handleChange} required />
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
}

export default AddBookForm;
