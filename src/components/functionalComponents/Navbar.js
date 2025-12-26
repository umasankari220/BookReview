import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const styles = {
    nav: {
      backgroundColor: theme.colors.primary,
      padding: '1rem 0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1rem'
    },
    logo: {
      color: '#fff',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      transition: 'transform 0.3s ease'
    },
    links: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    link: {
      color: '#ecf0f1',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      fontWeight: '500'
    },
    welcome: {
      color: '#ecf0f1',
      marginLeft: '1rem',
      fontSize: '0.9rem'
    },
    logoutBtn: {
      backgroundColor: theme.colors.error,
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    themeToggle: {
      backgroundColor: 'transparent',
      border: '2px solid #ecf0f1',
      color: '#ecf0f1',
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease',
      marginLeft: '0.5rem'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          📚 BookReview
        </Link>
        
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/books" style={styles.link}>Books</Link>
          
          {isAuthenticated ? (
            <>
              {user?.isAdmin && <Link to="/add-book" style={styles.link}>Add Book</Link>}
              {user?.isAdmin && <Link to="/admin" style={styles.link}>Admin</Link>}
              <Link to="/profile" style={styles.link}>Profile</Link>
              <span style={styles.welcome}>Hi, {user?.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
          
          <button onClick={toggleTheme} style={styles.themeToggle}>
            {theme.isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;