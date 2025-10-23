import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/LandingPage.css';

export default function LandingPage({ onUserLogin }) {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/home');
  }, [navigate]);

  const handleLoginSuccess = (user) => {
    onUserLogin(user);
    navigate('/home');
  };

  return (
    <div className="landing-page">
      <h1>Livros Vai e Vem</h1>
      <div className="forms-container">
        {showLogin ? (
          <LoginForm onLogin={handleLoginSuccess} />
        ) : (
          <RegisterForm onRegister={handleLoginSuccess} />
        )}
      </div>
      <button onClick={() => setShowLogin(!showLogin)}>
        {showLogin ? 'Criar conta' : 'Já tenho conta'}
      </button>
    </div>
  );
}
