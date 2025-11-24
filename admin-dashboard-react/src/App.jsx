import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [streamerId, setStreamerId] = useState(localStorage.getItem('streamerId') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('streamerId'));

  const handleLogin = (id) => {
    localStorage.setItem('streamerId', id);
    setStreamerId(id);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('streamerId');
    setStreamerId('');
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard 
          streamerId={streamerId} 
          apiUrl={API_URL}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
