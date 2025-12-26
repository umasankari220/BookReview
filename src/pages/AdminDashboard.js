import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchAllReviews();
  }, [isAuthenticated, user, navigate]);

  const fetchAllReviews = async () => {
    try {
      const response = await api.get('/reviews/admin/all');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard - Review Moderation</h1>
      
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>Total Reviews</h3>
          <p style={styles.statNumber}>{reviews.length}</p>
        </div>
      </div>

      <div style={styles.reviewsList}>
        {reviews.map(review => (
          <div key={review._id} style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <div style={styles.bookInfo}>
                <h4 style={styles.bookTitle}>{review.book.title}</h4>
                <p style={styles.bookAuthor}>by {review.book.author}</p>
              </div>
              <div style={styles.userInfo}>
                <p><strong>Reviewer:</strong> {review.user.name}</p>
                <p><strong>Email:</strong> {review.user.email}</p>
              </div>
            </div>
            
            <div style={styles.reviewContent}>
              <div style={styles.rating}>
                <span style={styles.stars}>{renderStars(review.rating)}</span>
                <span>({review.rating}/5)</span>
              </div>
              <p style={styles.comment}>{review.comment}</p>
              <small style={styles.date}>
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
            
            <div style={styles.actions}>
              <button 
                onClick={() => handleDeleteReview(review._id)}
                style={styles.deleteBtn}
              >
                Delete Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem'
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3498db',
    margin: '0.5rem 0'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1'
  },
  bookInfo: {
    flex: 1
  },
  bookTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '0.25rem'
  },
  bookAuthor: {
    color: '#7f8c8d'
  },
  userInfo: {
    textAlign: 'right'
  },
  reviewContent: {
    marginBottom: '1rem'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  stars: {
    color: '#f39c12',
    fontSize: '1.2rem'
  },
  comment: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#34495e',
    marginBottom: '0.5rem'
  },
  date: {
    color: '#95a5a6'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default AdminDashboard;