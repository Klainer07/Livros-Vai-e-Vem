import { useNavigate } from 'react-router-dom';
import AddBookForm from '../components/AddBookForm';
import '../styles/HomePage.css'; 

export default function AddBookPage() {
  const navigate = useNavigate();

  const handleBookAdded = (newBook) => {
    navigate('/');
  };

  return (
    <div className="home-page">
      <header>
        <h1>Cadastrar Livro</h1>
        <button onClick={() => navigate('/')}>Voltar</button>
      </header>

      <main>
        <AddBookForm onBookAdded={handleBookAdded} />
      </main>
    </div>
  );
}
