import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/EditBookPage.css';

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [autoCover, setAutoCover] = useState(null);
  const [loadingCover, setLoadingCover] = useState(false);

  
  useEffect(() => {
    api.get(`/books/${id}`)
      .then(res => {
        setBook(res.data);
        setAutoCover(res.data.cover_image || null);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  
  useEffect(() => {
    if (!book?.title) return;

    const fetchPreview = async () => {
      setLoadingCover(true);
      try {
        const response = await api.get('/books/preview', { params: { title: book.title, author: book.author } });
        setAutoCover(response.data.cover_image || null);
      } catch {
        setAutoCover(null);
      } finally {
        setLoadingCover(false);
      }
    };

    const delay = setTimeout(fetchPreview, 500); 
    return () => clearTimeout(delay);
  }, [book?.title, book?.author]);

  // Autocomplete de localização
  useEffect(() => {
    if (!book?.location?.trim()) {
      setLocationSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
        const data = await res.json();
        const suggestions = data
          .map(city => city.nome)
          .filter(name => name.toLowerCase().startsWith(book.location.toLowerCase()))
          .slice(0, 5);
        setLocationSuggestions(suggestions);
      } catch {
        setLocationSuggestions([]);
      }
    };

    const delay = setTimeout(fetchLocations, 300);
    return () => clearTimeout(delay);
  }, [book?.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationClick = (city) => {
    setBook(prev => ({ ...prev, location: city }));
    setLocationSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/books/${id}`, { ...book, cover_image: autoCover });
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

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={book.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={book.author}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="genre"
            placeholder="Gênero"
            value={book.genre || ''}
            onChange={handleChange}
          />
          <input
            type="text"
            name="condition"
            placeholder="Condição"
            value={book.condition || ''}
            onChange={handleChange}
          />

          
          <div className="autocomplete-container">
            <input
              type="text"
              name="location"
              placeholder="Localização"
              value={book.location || ''}
              onChange={handleChange}
            />
            {locationSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {locationSuggestions.map((city) => (
                  <li key={city} onClick={() => handleLocationClick(city)}>
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          
          <select name="status" value={book.status} onChange={handleChange}>
            <option value="para emprestar">Para emprestar</option>
            <option value="para doar">Para doar</option>
          </select>

          <div className="actions">
            <button type="submit">Salvar</button>
            <button type="button" className="delete" onClick={handleDelete}>Excluir Livro</button>
          </div>
        </form>

        
        <div className="cover-preview">
          <h4>Preview da Capa</h4>
          {loadingCover ? (
            <p>Carregando...</p>
          ) : autoCover ? (
            <img
              src={autoCover}
              alt="Preview da capa"
              onError={(e) => (e.currentTarget.src = '/no-cover.png')}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#29004a',
                borderRadius: '8px',
                color: '#fff'
              }}
            >
              Imagem não disponível
            </div>
          )}
        </div>
      </div>

      <button style={{ marginTop: '20px' }} onClick={() => navigate('/home')}>Voltar</button>
    </div>
  );
}
