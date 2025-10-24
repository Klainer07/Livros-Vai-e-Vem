import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/HomePage.css';

export default function SentedRequests({ user }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    api.get('/transactions')
      .then(res => {
        const sent = res.data.filter(tr => tr.receiver?.id === user.id);
        setRequests(sent);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const traduzirStatus = (status) => {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Recusado';
      default: return status;
    }
  };

  const traduzirTipo = (type) => {
    switch(type) {
      case 'borrow': return 'Empréstimo';
      default: return type;
    }
  };

  if (!user) return <p>Carregando usuário...</p>;
  if (loading) return <p>Carregando transações...</p>;

  return (
    <div className="home-page">
      <header>
        <h2>Pedidos de Empréstimos Enviados</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>

      <main>
        {requests.length === 0 ? (
          <p>Nenhum pedido enviado.</p>
        ) : (
          requests.map(tr => (
            <div key={tr.id} className="book-card">
              <h3>{tr.book?.title || 'Livro desconhecido'}</h3>
              <p>Solicitado de: {tr.sender?.name || 'Desconhecido'}</p>
              <p>Tipo: {traduzirTipo(tr.type)}</p>
              <p>Status: {traduzirStatus(tr.status)}</p>
              
            </div>
          ))
        )}
      </main>
    </div>
  );
}
