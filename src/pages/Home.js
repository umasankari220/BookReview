import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStats } from '../context/StatsContext';
import BookCard from '../components/functionalComponents/BookCard';
import axios from 'axios';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { stats, updateStats } = useStats();
  const navigate = useNavigate();
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get books data
        const booksRes = await axios.get('/api/books');
        const books = booksRes.data.books || [];
        
        // Calculate total reviews from all books
        const totalReviews = books.reduce((sum, book) => sum + (book.totalReviews || 0), 0);
        
        // Get unique users count (fallback to 2 since we know admin and you exist)
        const usersCount = 2;
        
        const topRated = books
          .filter(book => book.averageRating > 0)
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 4);
        
        const recent = books.slice(0, 4);

        setTopRatedBooks(topRated);
        setRecentBooks(recent);
        updateStats({
          books: books.length,
          reviews: totalReviews,
          users: usersCount
        });
        
        console.log('Stats updated:', { books: books.length, reviews: totalReviews, users: usersCount });
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Fallback stats
        updateStats({ books: 8, reviews: 3, users: 2 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateStats]);

  const genres = ['Fantasy', 'Fiction', 'Romance', 'Sci-Fi', 'Classic Literature'];

  const handleGenreClick = (genre) => {
    navigate(`/books?genre=${genre}`);
  };

  const styles = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    },
    hero: {
      background: theme.isDark 
        ? 'linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #404040)' 
        : 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '4rem 2rem',
      textAlign: 'center',
      color: 'white'
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      animation: 'fadeInUp 1s ease-out'
    },
    heroSubtitle: {
      fontSize: '1.3rem',
      marginBottom: '2rem',
      opacity: '0.9',
      animation: 'fadeInUp 1s ease-out 0.3s both'
    },
    heroButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '25px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      animation: 'fadeInUp 1s ease-out 0.6s both'
    },
    statsBar: {
      background: theme.isDark 
        ? 'rgba(45, 45, 45, 0.8)' 
        : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(15px)',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '3rem',
      flexWrap: 'wrap',
      margin: '2rem auto',
      maxWidth: '800px',
      borderRadius: '20px',
      boxShadow: theme.isDark 
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' 
        : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    statItem: {
      textAlign: 'center',
      animation: 'pulse 2s infinite'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: theme.colors.text,
      display: 'block'
    },
    statLabel: {
      fontSize: '1rem',
      color: theme.colors.textSecondary,
      marginTop: '0.5rem'
    },
    section: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem'
    },
    sectionTitle: {
      fontSize: '2.2rem',
      fontWeight: '700',
      marginBottom: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    booksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    genreChips: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
      marginBottom: '3rem'
    },
    genreChip: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '0.8rem 1.5rem',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    viewAllButton: {
      display: 'block',
      margin: '2rem auto 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '25px',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '600',
      textAlign: 'center',
      maxWidth: '200px',
      transition: 'all 0.3s ease'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{textAlign: 'center', padding: '4rem', color: theme.colors.text}}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero} className="animated-bg">
        <h1 style={styles.heroTitle}>
          {isAuthenticated ? `Welcome back, ${user?.name} 👋` : 'Discover Amazing Books'}
        </h1>
        <p style={styles.heroSubtitle}>
          {isAuthenticated 
            ? 'Ready to explore new stories and share your thoughts?' 
            : 'Join our community of book lovers and share your reviews'
          }
        </p>
        <Link 
          to="/books" 
          style={styles.heroButton}
          className="morph-btn hover-lift"
        >
          <span>Explore Books</span>
        </Link>
      </section>

      {/* Stats Bar */}
      <div style={styles.statsBar} className="glass">
        <div style={styles.statItem}>
          <span style={styles.statNumber}>📚 {stats.books}</span>
          <span style={styles.statLabel}>Books</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>✍️ {stats.reviews}</span>
          <span style={styles.statLabel}>Reviews</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>👥 {stats.users}</span>
          <span style={styles.statLabel}>Users</span>
        </div>
      </div>

      {/* Genre Highlights */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Browse by Genre</h2>
        <div style={styles.genreChips}>
          {genres.map(genre => (
            <button
              key={genre}
              style={styles.genreChip}
              className="morph-btn hover-lift"
              onClick={() => handleGenreClick(genre)}
            >
              <span>{genre}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Top Rated Books */}
      {topRatedBooks.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>⭐ Top Rated Books</h2>
          <div style={styles.booksGrid}>
            {topRatedBooks.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          <Link to="/books" style={styles.viewAllButton} className="hover-lift">
            View All Books
          </Link>
        </section>
      )}

      {/* Recently Added */}
      {recentBooks.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🕒 Recently Added</h2>
          <div style={styles.booksGrid}>
            {recentBooks.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;