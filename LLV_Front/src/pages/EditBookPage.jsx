import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/EditBookPage.css';

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/books/${id}`, book);
      alert('Livro atualizado com sucesso!');
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o livro.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este livro?')) return;
    try {
      await api.delete(`/books/${id}`);
      alert('Livro deletado com sucesso!');
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar o livro.');
    }
  };

  if (loading) return <p>Carregando livro...</p>;
  if (!book) return <p>Livro não encontrado.</p>;

  return (
    <div className="edit-book-page">
      <h2>Editar Livro</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input name="title" value={book.title} onChange={handleChange} required />
        </label>

        <label>
          Autor:
          <input name="author" value={book.author} onChange={handleChange} required />
        </label>

        <label>
          Gênero:
          <input name="genre" value={book.genre || ''} onChange={handleChange} />
        </label>

        <label>
          Local:
          <input name="location" value={book.location || ''} onChange={handleChange} />
        </label>

        <label>
          Status:
          <select name="status" value={book.status} onChange={handleChange}>
            <option value="disponível">Disponível</option>
            <option value="emprestado">Emprestado</option>
            <option value="trocado">Trocado</option>
          </select>
        </label>

        <div className="actions">
          <button type="submit">Salvar</button>
          <button type="button" className="delete" onClick={handleDelete}>Excluir Livro</button>
        </div>
      </form>

      <button onClick={() => navigate('/home')}>Voltar</button>
    </div>
  );
}
