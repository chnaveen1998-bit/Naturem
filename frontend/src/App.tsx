import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RemedyList from './pages/RemedyList';
import RemedyDetail from './pages/RemedyDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Boards from './pages/Boards';
import { authService } from './services/auth';
import type { User } from './types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.clearAuth();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🌿 Naturem
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/remedies" className="nav-link">
                  Remedies
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/boards" className="nav-link">
                  Community
                </Link>
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link">
                        Admin
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link btn-link">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/remedies" element={<RemedyList />} />
            <Route path="/remedies/:id" element={<RemedyDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/boards" element={<Boards />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Naturem - Natural Remedies Platform</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

