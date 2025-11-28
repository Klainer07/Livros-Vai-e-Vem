import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/HomePage.css';

export default function SentRequests({ user }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return;

    api.get('/transactions')
      .then(res => {
        
        const sent = res.data.filter(tr => tr.receiver?.id === user.id);
        setRequests(sent);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const traduzirStatus = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Recusado';
      default: return status;
    }
  };

  
  const traduzirTipo = (bookStatus) => {
    if (bookStatus === 'para emprestar' || bookStatus === 'emprestado') return 'Empréstimo';
    if (bookStatus === 'para doar' || bookStatus === 'doado') return 'Doação';
    return 'Desconhecido';
  };

  if (!user || !user.id) return <p>Carregando usuário...</p>;
  if (loading) return <p>Carregando transações...</p>;

  return (
    <div className="home-page">
      <header>
        <h2>Meus Pedidos de Empréstimo/Doação</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>

      <main>
        {requests.length === 0 ? (
          <p>Nenhum pedido enviado.</p>
        ) : (
          requests.map(tr => (
            <div key={tr.id} className="book-card">

              
              {tr.book?.cover_image ? (
                <img
                  src={tr.book.cover_image}
                  alt={`Capa de ${tr.book.title}`}
                  className="book-cover"
                  onError={(e) => e.currentTarget.src = '/no-cover.png'}
                />
              ) : (
                <div className="no-cover">Imagem não disponível</div>
              )}

              <h3>{tr.book?.title || 'Livro desconhecido'}</h3>
              <p>Dono do livro: {tr.sender?.name || 'Desconhecido'}</p>

              
              <p>Tipo: {traduzirTipo(tr.book?.status)}</p>
              <p>Status: {traduzirStatus(tr.status)}</p>

              
              {tr.status === 'approved' && (
                <button
                  className="chat-btn"
                  onClick={() => navigate(`/chat/${tr.book_id}/${user.id}/${tr.sender.id}`)}
                >
                  Abrir Chat
                </button>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
