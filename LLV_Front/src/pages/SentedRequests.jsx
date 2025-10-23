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
        // Filtra receiver em vez de sender, talvez refatorar api e model
        const sent = res.data.filter(tr => tr.receiver?.id === user.id);
        setRequests(sent);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleUpdateStatus = async (transactionId, newStatus) => {
    try {
      await api.put(`/transactions/${transactionId}`, { status: newStatus });
      setRequests(prev =>
        prev.map(tr =>
          tr.id === transactionId ? { ...tr, status: newStatus } : tr
        )
      );
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Erro ao atualizar status da transação.');
    }
  };

  if (!user) return <p>Carregando usuário...</p>;
  if (loading) return <p>Carregando transações...</p>;

  return (
    <div className="home-page">
      <header>
        <h2>Pedidos que Recebi para Emprestar</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>

      <main>
        {requests.length === 0 ? (
          <p>Nenhum pedido recebido.</p>
        ) : (
          requests.map(tr => (
            <div key={tr.id} className="book-card">
              <h3>{tr.book?.title || 'Livro desconhecido'}</h3>
              <p>Livro de: {tr.sender?.name || 'Desconhecido'}</p>
              <p>Tipo: {tr.type}</p>
              <p>Status: {tr.status}</p>

              {tr.status === 'pending' && (
                <div className="action-buttons">
                  <button onClick={() => handleUpdateStatus(tr.id, 'approved')}>
                    Confirmar Empréstimo
                  </button>
                  <button onClick={() => handleUpdateStatus(tr.id, 'rejected')}>
                    Recusar Pedido
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
