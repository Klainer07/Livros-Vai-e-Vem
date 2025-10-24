import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AddBookPage from './pages/AddBookPage';
import ReceivedRequests from './pages/ReceivedRequests';
import SentedRequests from './pages/SentedRequests';
import EditBookPage from './pages/EditBookPage.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleUserLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token); // se tiver token, precisa do token melhor dizendo
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onUserLogin={handleUserLogin} />} />
        <Route path="/home" element={<HomePage user={user} />} />
        <Route path="/add-book" element={<AddBookPage user={user} />} />
        <Route path="/requests" element={<ReceivedRequests user={user} />} />
        <Route path="/sented-requests" element={<SentedRequests user={user} />} />
        <Route path="/edit-book/:id" element={<EditBookPage />} />
      </Routes>
    </Router>
  );
}

export default App;
