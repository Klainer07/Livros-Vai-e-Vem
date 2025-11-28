import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/AddBookForm.css';

export default function AddBookForm({ onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [autoCover, setAutoCover] = useState(null);
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [status, setStatus] = useState('para emprestar'); // valor padrão
  const [error, setError] = useState('');
  const [loadingCover, setLoadingCover] = useState(false);

  
  useEffect(() => {
    const fetchPreview = async () => {
      if (title.trim().length < 2 && (author?.trim().length ?? 0) < 2) return;

      setLoadingCover(true);

      try {
        const response = await api.get('/books/preview', { params: { title, author } });
        setAutoCover(response.data.cover_image || null);
      } catch {
        setAutoCover(null);
      } finally {
        setLoadingCover(false);
      }
    };

    const delay = setTimeout(fetchPreview, 500);
    return () => clearTimeout(delay);
  }, [title, author]);

  // Obrigado IBGE
  useEffect(() => {
    const fetchLocations = async () => {
      if (!location.trim()) {
        setLocationSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
        );
        const data = await res.json();
        const suggestions = data
          .map((city) => city.nome)
          .filter((name) =>
            name.toLowerCase().startsWith(location.toLowerCase())
          )
          .slice(0, 5); 
        setLocationSuggestions(suggestions);
      } catch (err) {
        setLocationSuggestions([]);
      }
    };

    const delay = setTimeout(fetchLocations, 300);
    return () => clearTimeout(delay);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = localStorage.getItem('user');
    if (!userData) {
      setError('Usuário não encontrado.');
      return;
    }
    const user = JSON.parse(userData);

    try {
      const response = await api.post('/books', {
        title,
        author,
        genre,
        condition,
        cover_image: autoCover,
        location,
        status,
        user_id: user.id
      });

      alert('Livro cadastrado com sucesso!');
      onBookAdded(response.data);

      // Reset form, gambiarra para o preview da capa
      setTitle('');
      setAuthor('');
      setGenre('');
      setCondition('');
      setAutoCover(null);
      setLocation('');
      setStatus('para emprestar');
      setError('');
    } catch (err) {
      console.error(err.response?.data || err);
      setError('Erro ao cadastrar o livro. Verifique os campos.');
    }
  };

  const handleLocationClick = (city) => {
    setLocation(city);
    setLocationSuggestions([]);
  };

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <h2>Cadastrar Novo Livro</h2>
      {error && <p className="error">{error}</p>}

      <div className="form-with-preview">
        
        <div className="form-fields">
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

          
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder="Localização"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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

          
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="para emprestar">Para emprestar</option>
            <option value="para doar">Para doar</option>
          </select>

          <button type="submit">Cadastrar Livro</button>
        </div>

        
        <div className="cover-preview">
          <h4>Preview da Capa</h4>
          <div className="cover-container">
            {loadingCover ? (
              <p>Carregando...</p>
            ) : autoCover ? (
              <img
                src={autoCover}
                alt="Preview da capa"
                onError={(e) => (e.currentTarget.src = '/no-cover.png')}
              />
            ) : (
              <p>Imagem não disponível</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
