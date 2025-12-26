import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksAPI, reviewsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import ReviewForm from '../components/functionalComponents/ReviewForm';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { incrementReviews } = useStats();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await booksAPI.getById(id);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
        navigate('/books');
      }

      try {
        const response = await reviewsAPI.getByBook(id);
        setReviews(response.data);
        
        if (isAuthenticated && user) {
          const existingReview = response.data.find(review => review.user._id === user._id);
          setUserReview(existingReview);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, user, navigate]);

  const fetchBookDetails = async () => {
    try {
      const response = await booksAPI.getById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      navigate('/books');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByBook(id);
      setReviews(response.data);
      
      if (isAuthenticated && user) {
        const existingReview = response.data.find(review => review.user._id === user._id);
        setUserReview(existingReview);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      if (editingReview) {
        await reviewsAPI.update(editingReview._id, reviewData);
      } else {
        await reviewsAPI.create(id, reviewData);
        incrementReviews(); // Increment stats for new reviews only
      }
      
      setShowReviewForm(false);
      setEditingReview(null);
      fetchReviews();
      fetchBookDetails(); // Refresh to update average rating
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsAPI.delete(reviewId);
        fetchReviews();
        fetchBookDetails();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!book) {
    return <div style={styles.error}>Book not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.bookInfo}>
        <img 
          src={book.coverImage} 
          alt={book.title}
          style={styles.coverImage}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        
        <div style={styles.details}>
          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.author}>by {book.author}</p>
          <span style={styles.genre}>{book.genre}</span>
          
          <div style={styles.rating}>
            <span style={styles.stars}>{renderStars(book.averageRating)}</span>
            <span style={styles.ratingText}>
              {book.averageRating.toFixed(1)} ({book.totalReviews} reviews)
            </span>
          </div>
          
          <p style={styles.description}>{book.description}</p>
          
          {isAuthenticated && !userReview && (
            <button 
              onClick={() => setShowReviewForm(true)}
              style={styles.reviewBtn}
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          onSubmit={handleSubmitReview}
          initialData={editingReview}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
        />
      )}

      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>Reviews ({reviews.length})</h2>
        
        {reviews.length > 0 ? (
          <div style={styles.reviewsList}>
            {reviews.map(review => (
              <div key={review._id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div>
                    <strong>{review.user.name}</strong>
                    <div style={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  {isAuthenticated && user && (user._id === review.user._id || user.isAdmin) && (
                    <div style={styles.reviewActions}>
                      {user._id === review.user._id && (
                        <button 
                          onClick={() => {
                            setEditingReview(review);
                            setShowReviewForm(true);
                          }}
                          style={styles.editBtn}
                        >
                          Edit
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                <p style={styles.reviewComment}>{review.comment}</p>
                <small style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noReviews}>No reviews yet. Be the first to review this book!</p>
        )}
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
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#e74c3c'
  },
  bookInfo: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '3rem',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  coverImage: {
    width: '300px',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  details: {
    flex: 1
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  author: {
    fontSize: '1.3rem',
    color: '#7f8c8d',
    marginBottom: '1rem'
  },
  genre: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    display: 'inline-block',
    marginBottom: '1rem'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  stars: {
    color: '#f39c12',
    fontSize: '1.5rem'
  },
  ratingText: {
    fontSize: '1.1rem',
    color: '#7f8c8d'
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#34495e',
    marginBottom: '2rem'
  },
  reviewBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '6px',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  reviewsSection: {
    marginTop: '3rem'
  },
  reviewsTitle: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem'
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
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  reviewRating: {
    color: '#f39c12',
    fontSize: '1.2rem',
    marginTop: '0.25rem'
  },
  reviewActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  editBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  reviewComment: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#34495e',
    marginBottom: '0.5rem'
  },
  reviewDate: {
    color: '#95a5a6'
  },
  noReviews: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
};

export default BookDetails;