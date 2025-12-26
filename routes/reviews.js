const express = require('express');
const { body } = require('express-validator');
const { getBookReviews, createReview, updateReview, deleteReview, getUserReviews, getAllReviews } = require('../controllers/reviewController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get reviews for a book (public)
router.get('/book/:bookId', getBookReviews);

// Get user's reviews (authenticated)
router.get('/user', auth, getUserReviews);

// Create review (authenticated)
router.post('/book/:bookId', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters')
], createReview);

// Update review (owner)
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters')
], updateReview);

// Delete review (owner or admin)
router.delete('/:id', auth, deleteReview);

// Get all reviews for moderation (admin only)
router.get('/admin/all', adminAuth, getAllReviews);

module.exports = router;