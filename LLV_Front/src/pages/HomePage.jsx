import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/HomePage.css';

export default function HomePage({ user: loggedUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(loggedUser);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [search, setSearch] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = loggedUser || JSON.parse(localStorage.getItem('user'));

    if (!token) {
      navigate('/');
      return;
    }

    setUser(userData);

    Promise.all([
      api.get('/books'),
      api.get('/transactions', { params: { receiver_id: userData.id } })
    ])
      .then(([booksRes, transactionsRes]) => {
        setBooks(booksRes.data);
        setTransactions(transactionsRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate, loggedUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleBorrow = async (book) => {
    try {
      const userData = user || JSON.parse(localStorage.getItem('user'));
      const payload = {
        book_id: book.id,
        sender_id: book.user.id,
        receiver_id: userData.id,
        type: 'borrow',
      };

      await api.post('/transactions', payload);
      alert('Pedido de empréstimo enviado com sucesso!');
      setTransactions(prev => [...prev, { book_id: book.id }]);
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Erro ao tentar pegar o livro emprestado.');
    }
  };

  if (loading) return <p>Carregando livros...</p>;

  const filteredBooks =
    activeTab === 'available'
      ? books.filter(b =>
          b.status === 'disponível' &&
          b.user.id !== user.id &&
          !transactions.some(t => t.book_id === b.id) &&
          (
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase()) ||
            b.genre?.toLowerCase().includes(search.toLowerCase()) ||
            b.location?.toLowerCase().includes(search.toLowerCase())
          )
        )
      : books.filter(b =>
          b.user.id === user.id &&
          (
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase()) ||
            b.genre?.toLowerCase().includes(search.toLowerCase()) ||
            b.location?.toLowerCase().includes(search.toLowerCase())
          )
        );

  return (
    <div className="home-page">
      <header>
        <h1>Livros Vai e Vem</h1>
        <div>
          <button onClick={() => navigate('/add-book')}>Cadastrar Livro</button>
          <button onClick={() => navigate('/requests')}>Pedidos Recebidos</button>
          <button onClick={() => navigate('/sented-requests')}>Pedidos Enviados</button>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main>
        <h2>Bem-vindo, {user?.name || 'Usuário'}!</h2>

        <div className="tab-buttons">
          <button
            className={activeTab === 'available' ? 'active' : ''}
            onClick={() => setActiveTab('available')}
          >
            Disponíveis
          </button>
          <button
            className={activeTab === 'mine' ? 'active' : ''}
            onClick={() => setActiveTab('mine')}
          >
            Meus livros
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por título, autor, gênero ou local..."
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="books-list">
          {filteredBooks.length === 0 ? (
            <p>Nenhum livro encontrado.</p>
          ) : (
            filteredBooks.map(book => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p>Autor: {book.author}</p>
                {book.genre && <p>Gênero: {book.genre}</p>}
                {book.location && <p>Local: {book.location}</p>}
                <p>Dono: {book.user.name}</p>
                {activeTab === 'mine' && (
                  <p>Status: {book.status === 'disponível' ? 'Disponível' : 'Emprestado'}</p>
                )}
                {activeTab === 'available' && (
                  <button onClick={() => handleBorrow(book)}>Pegar emprestado</button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
