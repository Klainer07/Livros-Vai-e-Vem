import { useState } from 'react';
import api from '../services/api';
import '../styles/RegisterForm.css';

export default function RegisterForm({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      return setError('Por favor, preencha todos os campos obrigatórios.');
    }

    try {
      setLoading(true);
      const response = await api.post('/users', formData);
      setSuccess('Usuário cadastrado com sucesso!');
      onRegister(response.data);
      setFormData({ name: '', username: '', email: '', password: '', bio: '' });
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao criar usuário. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Criar Conta</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input
        type="text"
        name="name"
        placeholder="Nome completo *"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Nome de usuário *"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="E-mail *"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Senha *"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <textarea
        name="bio"
        placeholder="Escreva um pouco sobre você (opcional)"
        value={formData.bio}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}
