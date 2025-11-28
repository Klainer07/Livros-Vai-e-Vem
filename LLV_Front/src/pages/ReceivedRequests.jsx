import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/HomePage.css';

export default function SentRequests({ user }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [ratings, setRatings] = useState([]);
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

  
  useEffect(() => {
    api.get('/ratings')
      .then(res => setRatings(res.data))
      .catch(err => console.error(err));
  }, []);

  
  const handleUpdateStatus = async (tr, newStatus) => {
    try {
      await api.put(`/transactions/${tr.id}`, { status: newStatus });


      if (newStatus === 'approved') {
        const newBookStatus = tr.book.status === 'para emprestar' ? 'emprestado' : 'doado';
        await api.put(`/books/${tr.book.id}`, { status: newBookStatus });
        tr.book.status = newBookStatus; 
      }

      setRequests(prev =>
        prev.map(r => r.id === tr.id ? { ...r, status: newStatus } : r)
      );
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Erro ao atualizar status da transação.');
    }
  };

  
  const handleRating = async (tr, ratingValue) => {
    try {
      const res = await api.post(`/ratings`, {
        transaction_id: tr.id,
        rater_id: user.id,
        rated_user_id: tr.receiver.id,
        book_id: tr.book.id,
        score: ratingValue,
        comment: ""
      });

      setRatings(prev => [...prev, res.data]);
      alert("Avaliação enviada com sucesso!");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Erro ao enviar avaliação.");
    }
  };

  
  const traduzirStatus = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'completed': return 'Concluído';
      case 'rejected': return 'Recusado';
      default: return status;
    }
  };

  
  const traduzirBookStatus = (status) => {
    switch (status) {
      case 'para emprestar': return 'Disponível para Empréstimo';
      case 'para doar': return 'Disponível para Doação';
      case 'emprestado': return 'Emprestado';
      case 'doado': return 'Doado';
      default: return status;
    }
  };

  
  const traduzirTipo = (bookStatus) => {
    if (bookStatus === 'para emprestar' || bookStatus === 'emprestado') return 'Empréstimo';
    if (bookStatus === 'para doar' || bookStatus === 'doado') return 'Doação';
    return 'Desconhecido';
  };

  
  const calcularMedia = (notas) => {
    if (notas.length === 0) return 0;
    const soma = notas.reduce((acc, n) => acc + n, 0);
    return (soma / notas.length).toFixed(1);
  };

  if (!user || !user.id) return <p>Carregando usuário...</p>;
  if (loading) return <p>Carregando transações...</p>;

  return (
    <div className="home-page">
      <header>
        <h2>Pedidos Recebidos</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>

      <main>
        {requests.length === 0 ? (
          <p>Nenhum pedido recebido.</p>
        ) : (
          requests.map(tr => {
            const receiverRatings = ratings.filter(
              r => r.rated_user_id === tr.receiver.id
            );

            const myRatingForThisTransaction = ratings.find(
              r => r.transaction_id === tr.id && r.rater_id === user.id
            );

            const media = calcularMedia(receiverRatings.map(r => r.score));

            return (
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
                <p>Solicitado por: {tr.receiver?.name || 'Desconhecido'}</p>
                <p>Tipo: {traduzirTipo(tr.book?.status)}</p>
                <p>Status do livro: {traduzirBookStatus(tr.book?.status)}</p>
                <p>Status da transação: {traduzirStatus(tr.status)}</p>

                
                <div style={{ marginTop: '6px' }}>
                  {receiverRatings.length > 0 ? (
                    <p>Avaliação média do usuário: {media} ★ ({receiverRatings.length} avaliações)</p>
                  ) : (
                    <p>Esse usuário ainda não recebeu avaliações.</p>
                  )}
                </div>

                
                {tr.status === 'pending' && (
                  <div className="action-buttons">
                    <button
                      className="confirm-btn"
                      onClick={() => handleUpdateStatus(tr, 'approved')}
                    >
                      Confirmar {tr.book?.status === 'para emprestar' ? 'Empréstimo' : 'Doação'}
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleUpdateStatus(tr, 'rejected')}
                    >
                      Recusar {tr.book?.status === 'para emprestar' ? 'Empréstimo' : 'Doação'}
                    </button>
                  </div>
                )}

                
                {tr.status === 'approved' && (
                  <>
                    <button
                      className="chat-btn"
                      onClick={() =>
                        navigate(`/chat/${tr.book_id}/${user.id}/${tr.receiver.id}`)
                      }
                    >
                      Abrir Chat
                    </button>

                    <button
                      className="confirm-btn"
                      onClick={() => {
                        const confirmado = window.confirm(
                          "Ao concluir a transação, não será possível voltar atrás.\n\nTem certeza?"
                        );

                        if (!confirmado) return;
                        handleUpdateStatus(tr, 'completed');
                      }}
                    >
                      Marcar como Concluído
                    </button>
                  </>
                )}

                
                {tr.status === 'completed' && (
                  <div style={{ marginTop: '10px' }}>
                    {myRatingForThisTransaction ? (
                      <p>
                        Você já avaliou este usuário: <strong>{myRatingForThisTransaction.score} ★</strong>
                      </p>
                    ) : (
                      <>
                        <label>Avaliação:</label>
                        <select
                          value=""
                          onChange={(e) => handleRating(tr, Number(e.target.value))}
                        >
                          <option value="">Escolher nota</option>
                          <option value="1">★☆☆☆☆</option>
                          <option value="2">★★☆☆☆</option>
                          <option value="3">★★★☆☆</option>
                          <option value="4">★★★★☆</option>
                          <option value="5">★★★★★</option>
                        </select>
                      </>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
