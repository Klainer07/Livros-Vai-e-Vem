import { useState } from 'react';
import api from '../services/api';
import '../styles/AddBookForm.css';

export default function AddBookForm({ onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('disponível');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.post('/books', {
        title,
        author,
        genre,
        condition,
        cover_image: coverImage,
        location,
        status,
        user_id: user.id
      });

      alert('Livro cadastrado com sucesso!');
      onBookAdded(response.data); // opcional: atualizar lista na HomePage
      setTitle('');
      setAuthor('');
      setGenre('');
      setCondition('');
      setCoverImage('');
      setLocation('');
      setStatus('disponível');
      setError('');
    } catch (err) {
      console.error(err.response?.data || err);
      setError('Erro ao cadastrar o livro. Verifique os campos.');
    }
  };

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <h2>Cadastrar Novo Livro</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Gênero"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Condição"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      />
      <input
        type="url"
        placeholder="URL da capa"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        // será mudado
      />
      <input
        type="text"
        placeholder="Localização"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="disponível">Disponível</option>
        <option value="emprestado">Emprestado</option>
        <option value="trocado">Trocado</option>
      </select>
      <button type="submit">Cadastrar Livro</button>
    </form>
  );
}
