import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredReview, setHoveredReview] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/reviews/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    },
    profileCard: {
      background: theme.isDark 
        ? 'rgba(45, 45, 45, 0.8)' 
        : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      border: theme.isDark 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '25px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: theme.isDark 
        ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' 
        : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center'
    },
    userInfo: {
      marginBottom: '2rem'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      fontSize: '1.1rem'
    },
    label: {
      fontWeight: '600',
      color: theme.colors.text,
      minWidth: '100px',
      marginRight: '1rem'
    },
    value: {
      color: theme.colors.textSecondary
    },
    reviewsSection: {
      marginTop: '2rem'
    },
    reviewsTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    reviewCount: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600'
    },
    reviewItem: {
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderLeft: '4px solid #667eea',
      borderRadius: '15px',
      padding: '1.5rem',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: theme.isDark 
        ? '0 0 20px rgba(102, 126, 234, 0.3)' 
        : '0 0 15px rgba(102, 126, 234, 0.2)',
      cursor: 'pointer'
    },
    reviewItemHover: {
      transform: 'translateY(-5px)',
      boxShadow: theme.isDark 
        ? '0 10px 30px rgba(102, 126, 234, 0.4)' 
        : '0 10px 25px rgba(102, 126, 234, 0.3)',
    },
    reviewBook: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '0.5rem'
    },
    reviewRating: {
      color: '#ffd700',
      fontSize: '1.2rem',
      marginBottom: '0.5rem'
    },
    reviewComment: {
      color: theme.colors.textSecondary,
      lineHeight: '1.5'
    },
    themeToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: theme.colors.surface,
      borderRadius: '15px',
      border: `1px solid ${theme.colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    toggleButton: {
      width: '60px',
      height: '30px',
      borderRadius: '15px',
      background: theme.isDark 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : '#ddd',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    toggleCircle: {
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      background: 'white',
      position: 'absolute',
      top: '2px',
      left: theme.isDark ? '32px' : '2px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      color: theme.colors.textSecondary
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading} className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard} className="glass hover-lift">
        <h1 style={styles.title} className="text-gradient">My Profile</h1>
        
        <div style={styles.userInfo}>
          <div style={styles.infoItem}>
            <span style={styles.label}>Username:</span>
            <span style={styles.value}>{user?.name}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{user?.email}</span>
          </div>
        </div>

        <div style={styles.themeToggle} onClick={toggleTheme}>
          <span style={{color: theme.colors.text, fontWeight: '600'}}>
            Theme Preference: {theme.isDark ? 'Dark' : 'Light'}
          </span>
          <div style={styles.toggleButton}>
            <div style={styles.toggleCircle}></div>
          </div>
          <span style={{fontSize: '1.2rem'}}>
            {theme.isDark ? '🌙' : '☀️'}
          </span>
        </div>
      </div>

      <div style={styles.profileCard} className="glass">
        <div style={styles.reviewsSection}>
          <h2 style={styles.reviewsTitle}>
            My Reviews 
            <span style={styles.reviewCount}>{reviews.length}</span>
          </h2>
          
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div 
                key={review._id} 
                style={{
                  ...styles.reviewItem,
                  ...(hoveredReview === review._id ? styles.reviewItemHover : {})
                }}
                onMouseEnter={() => setHoveredReview(review._id)}
                onMouseLeave={() => setHoveredReview(null)}
              >
                <div style={styles.reviewBook}>{review.book?.title}</div>
                <div style={styles.reviewRating}>
                  {renderStars(review.rating)}
                </div>
                <div style={styles.reviewComment}>{review.comment}</div>
              </div>
            ))
          ) : (
            <div style={{...styles.loading, padding: '1rem'}}>
              No reviews yet. Start reviewing books!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;