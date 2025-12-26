import React, { useState } from 'react';

const ReviewForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 5,
    comment: initialData?.comment || ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.comment.trim().length < 5) {
      setError('Comment must be at least 5 characters long');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>
        {initialData ? 'Edit Review' : 'Write a Review'}
      </h3>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.field}>
        <label style={styles.label}>Rating:</label>
        <select
          value={formData.rating}
          onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
          style={styles.select}
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Comment:</label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          placeholder="Share your thoughts about this book..."
          rows="4"
          style={styles.textarea}
          required
        />
      </div>

      <div style={styles.buttons}>
        <button type="submit" style={styles.submitBtn}>
          {initialData ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  title: {
    marginBottom: '1rem',
    color: '#2c3e50'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '0.5rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  field: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#34495e'
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical'
  },
  buttons: {
    display: 'flex',
    gap: '1rem'
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default ReviewForm;