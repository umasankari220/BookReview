const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Book = require('./models/Book');
const Review = require('./models/Review');

// ---------------- CONNECT DATABASE ----------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// ---------------- SEED DATA ----------------
const seedData = async () => {
  try {
    // ❗ Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // 🔐 Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    // 👤 Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      isAdmin: true
    });

    // 👤 Create normal user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      isAdmin: false
    });

    // 📚 Create books
    const books = await Book.insertMany([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
        description: 'A classic American novel set in the Jazz Age.',
        coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
        addedBy: adminUser._id
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        description: 'A novel about racial injustice and moral growth.',
        coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
        addedBy: adminUser._id
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        description: 'A dystopian novel about totalitarian control.',
        coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
        addedBy: adminUser._id
      },
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        description: 'A young wizard’s journey begins.',
        coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
        addedBy: regularUser._id
      }
    ]);

    // ✍️ Create reviews
    await Review.insertMany([
      {
        book: books[0]._id,
        user: regularUser._id,
        rating: 5,
        comment: 'Amazing book! Highly recommended.'
      },
      {
        book: books[1]._id,
        user: regularUser._id,
        rating: 4,
        comment: 'Very powerful and emotional story.'
      }
    ]);

    // ⭐ Update ratings for each book
    for (const book of books) {
      const reviews = await Review.find({ book: book._id });

      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      await Book.findByIdAndUpdate(book._id, {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews
      });
    }

    console.log('✅ Demo data seeded successfully!');
    console.log('\n🔑 Demo Login Credentials');
    console.log('Admin  → admin@example.com / admin123');
    console.log('User   → john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// ---------------- RUN SEED (MANUAL ONLY) ----------------
const runSeed = async () => {
  await connectDB();
  await seedData();
};

// ❗ RUN ONLY WHEN YOU EXECUTE: node seed.js
runSeed();
