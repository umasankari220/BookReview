const express = require('express');
const { body } = require('express-validator');
const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Base books route
router.get('/info', (req, res) => {
  res.json({
    message: 'Books API',
    endpoints: {
      'get all books': 'GET /api/books',
      'get single book': 'GET /api/books/:id',
      'create book': 'POST /api/books (admin only)',
      'update book': 'PUT /api/books/:id (admin only)',
      'delete book': 'DELETE /api/books/:id (admin only)'
    }
  });
});

// Get all books (public)
router.get('/', getBooks);

// Get single book (public)
router.get('/:id', getBook);

// Create book (admin only)
router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('author').trim().isLength({ min: 1 }).withMessage('Author is required'),
  body('genre').trim().isLength({ min: 1 }).withMessage('Genre is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('coverImage').optional().isURL().withMessage('Cover image must be a valid URL')
], createBook);

// Update book (admin only)
router.put('/:id', adminAuth, updateBook);

// Delete book (admin only)
router.delete('/:id', adminAuth, deleteBook);

module.exports = router;