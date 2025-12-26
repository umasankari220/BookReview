import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: theme.isDark 
        ? 'linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #404040)' 
        : 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    formContainer: {
      background: theme.isDark 
        ? 'rgba(45, 45, 45, 0.8)' 
        : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      border: theme.isDark 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '25px',
      padding: '3rem',
      boxShadow: theme.isDark 
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' 
        : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      maxWidth: '450px',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    error: {
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      color: '#fff',
      padding: '1rem',
      borderRadius: '15px',
      marginBottom: '1.5rem',
      textAlign: 'center',
      fontWeight: '500',
      animation: 'pulse 2s infinite'
    },
    form: {
      marginBottom: '1.5rem'
    },
    field: {
      marginBottom: '1.5rem',
      position: 'relative'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: theme.colors.text,
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      padding: '1rem 1.5rem',
      border: `2px solid ${theme.colors.border}`,
      borderRadius: '15px',
      fontSize: '1rem',
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      transform: 'translateY(-2px)'
    },
    button: {
      width: '100%',
      padding: '1rem',
      border: 'none',
      borderRadius: '25px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
    },
    linkText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: '0.95rem'
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.3s ease'
    },
    floatingShape: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
      animation: 'floating 6s ease-in-out infinite'
    }
  };

  return (
    <div style={styles.container} className="animated-bg">
      <div style={styles.formContainer} className="glass">
        <div style={{...styles.floatingShape, width: '100px', height: '100px', top: '-50px', right: '-50px'}} />
        <div style={{...styles.floatingShape, width: '60px', height: '60px', bottom: '-30px', left: '-30px'}} />
        
        <h2 style={styles.title} className="text-gradient floating">
          Welcome Back
        </h2>
        
        {error && <div style={styles.error} className="pulse">{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              className="focus-ring"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              className="focus-ring"
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            className="morph-btn hover-lift"
            disabled={loading}
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <p style={styles.linkText}>
          New to BookReview? <Link to="/register" style={styles.link}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;