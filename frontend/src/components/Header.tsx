import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Naturem
          </Link>
        </h1>
        <nav className="nav">
          <Link to="/remedies">Remedies</Link>
          {isAuthenticated ? (
            <>
              <Link to="/boards">My Boards</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <span>Hello, {user?.username}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
