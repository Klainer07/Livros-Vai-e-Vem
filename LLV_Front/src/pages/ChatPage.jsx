import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/ChatPage.css';

export default function ChatPage({ user }) {
  const { bookId, receiverId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  
  const fetchMessages = async () => {
    if (!user) return;
    try {
      
      const res = await api.get(`/messages/${bookId}/${user.id}/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      
      setMessages([]); 
    } finally {
      setLoading(false);
    }
  };

  // Efeito principal: buscar mensagens e atualizar a cada 3s
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [user]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post('/messages/send', {
        book_id: bookId,
        sender_id: user.id,
        receiver_id: receiverId,
        message_text: newMessage,
      });
      setNewMessage('');
      fetchMessages(); // atualiza o chat
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar mensagem.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  if (!user) return <p>Carregando usuário...</p>;
  if (loading) return <p>Carregando chat...</p>;

  return (
    <div className="chat-page">
      <header>
        <button onClick={() => navigate(-1)}>Voltar</button>
        <h2>Chat do Livro</h2>
      </header>

      <main className="chat-messages">
        {messages.length === 0 && <p>Nenhuma mensagem ainda. Comece a conversar!</p>}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message ${msg.sender_id === user.id ? 'mine' : 'theirs'}`}
          >
            <p>{msg.message_text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer>
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </footer>
    </div>
  );
}
