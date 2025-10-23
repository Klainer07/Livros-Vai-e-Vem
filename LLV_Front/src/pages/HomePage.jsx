import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/HomePage.css';

export default function HomePage({ user: loggedUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(loggedUser);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = loggedUser || JSON.parse(localStorage.getItem('user'));

    if (!token) {
      navigate('/');
      return;
    }

    setUser(userData);

    api.get('/books')
      .then(res => {
        const availableBooks = res.data.filter(
          b => b.status === 'disponível' && b.user.id !== userData.id
        );
        setBooks(availableBooks);
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

      console.log('Payload enviado:', payload); // testando 
      await api.post('/transactions', payload);
      alert('Pedido de empréstimo enviado com sucesso!');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Erro ao tentar pegar o livro emprestado.');
    }
  };

  if (loading) {
    return <p>Carregando livros disponíveis...</p>;
  }

  return (
    <div className="home-page">
      <header>
        <h1>Livros Vai e Vem</h1>
        <div>
          <button onClick={() => navigate('/add-book')}> Cadastrar Livro</button>
          <button onClick={() => navigate('/requests')}> Pedidos Recebidos</button>
          <button onClick={() => navigate('/sented-requests')}> Pedidos Enviados</button>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main>
        <h2>Bem-vindo, {user?.name || 'Usuário'}!</h2>
        <p>Livros disponíveis para empréstimo:</p>

        <div className="books-list">
          {books.length === 0 ? (
            <p>Nenhum livro disponível no momento.</p>
          ) : (
            books.map(book => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p>Autor: {book.author}</p>
                <p>Dono: {book.user.name}</p>
                <button onClick={() => handleBorrow(book)}> Pegar emprestado</button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
