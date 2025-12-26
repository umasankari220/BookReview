import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const BookCard = ({ book }) => {
  const { theme } = useTheme();

  const getGenreColor = (genre) => {
    const genreColors = {
      'Fantasy': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      'Romance': 'linear-gradient(135deg, #e91e63, #ad1457)',
      'Fiction': 'linear-gradient(135deg, #3498db, #2980b9)',
      'Science Fiction': 'linear-gradient(135deg, #27ae60, #229954)',
      'Sci-Fi': 'linear-gradient(135deg, #27ae60, #229954)',
      'Classic Literature': 'linear-gradient(135deg, #f39c12, #e67e22)',
      'Dystopian Fiction': 'linear-gradient(135deg, #e74c3c, #c0392b)',
      'Coming-of-age': 'linear-gradient(135deg, #16a085, #138d75)'
    };
    return genreColors[genre] || 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
  };

  const styles = {
    card: {
      background: theme.isDark 
        ? 'rgba(45, 45, 45, 0.8)' 
        : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: theme.isDark 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '20px',
      padding: '1.5rem',
      textDecoration: 'none',
      color: theme.colors.text,
      display: 'block',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: theme.isDark 
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' 
        : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: theme.isDark 
        ? '0 15px 35px rgba(0, 0, 0, 0.8)' 
        : '0 15px 35px rgba(31, 38, 135, 0.6)',
    },
    imageContainer: {
      position: 'relative',
      marginBottom: '1rem',
      borderRadius: '15px',
      overflow: 'hidden',
      height: '200px',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s ease',
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: '600',
    },
    title: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1.3',
    },
    author: {
      fontSize: '1rem',
      color: theme.colors.textSecondary,
      marginBottom: '0.8rem',
      fontWeight: '500',
    },
    genre: {
      display: 'inline-block',
      color: 'white',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      marginBottom: '0.8rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    description: {
      fontSize: '0.9rem',
      color: theme.colors.textSecondary,
      lineHeight: '1.5',
      marginBottom: '1rem',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: 'auto',
    },
    stars: {
      color: '#ffd700',
      fontSize: '1.1rem',
    },
    ratingText: {
      fontSize: '0.9rem',
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.5s ease',
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars.join('');
  };

  return (
    <Link
      to={`/books/${book._id}`}
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      className="hover-lift glass"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        style={styles.shimmer}
        className={isHovered ? '' : ''}
      />
      
      <div style={styles.imageContainer}>
        <img
          src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'}
          alt={book.title}
          style={{
            ...styles.image,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        <div 
          style={{
            ...styles.imageOverlay,
            opacity: isHovered ? 1 : 0
          }}
        >
          View Details
        </div>
      </div>

      <h3 style={styles.title} className="text-gradient">
        {book.title}
      </h3>
      
      <p style={styles.author}>by {book.author}</p>
      
      <span style={{...styles.genre, background: getGenreColor(book.genre)}}>{book.genre}</span>
      
      <p style={styles.description}>{book.description}</p>
      
      <div style={styles.rating}>
        <span style={styles.stars}>
          {renderStars(book.averageRating || 0)}
        </span>
        <span style={styles.ratingText}>
          {book.averageRating ? book.averageRating.toFixed(1) : '0.0'} 
          ({book.totalReviews || 0} reviews)
        </span>
      </div>
    </Link>
  );
};

export default BookCard;