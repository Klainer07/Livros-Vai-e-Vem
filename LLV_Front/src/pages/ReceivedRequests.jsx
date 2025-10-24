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
        const sent = res.data.filter(tr => tr.sender?.id === user.id);
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

  const traduzirStatus = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Recusado';
      default: return status;
    }
  };

  const traduzirTipo = (type) => {
    switch (type) {
      case 'borrow': return 'Empréstimo';
      default: return type;
    }
  };

  if (!user || !user.id) return <p>Carregando usuário...</p>;
  if (loading) return <p>Carregando transações...</p>;

  return (
    <div className="home-page">
      <header>
        <h2>Pedidos de Empréstimo Recebidos</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>

      <main>
        {requests.length === 0 ? (
          <p>Nenhum pedido recebido.</p>
        ) : (
          requests.map(tr => (
            <div key={tr.id} className="book-card">
              <h3>{tr.book?.title || 'Livro desconhecido'}</h3>
              <p>Solicitado por: {tr.receiver?.name || 'Desconhecido'}</p>
              <p>Tipo: {traduzirTipo(tr.type)}</p>
              <p>Status: {traduzirStatus(tr.status)}</p>

              {tr.status === 'pending' && (
                <div className="action-buttons">
                  <button
                    className="confirm-btn"
                    onClick={() => handleUpdateStatus(tr.id, 'approved')}
                  >
                    Confirmar Empréstimo
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleUpdateStatus(tr.id, 'rejected')}
                  >
                    Recusar Empréstimo
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
