import React, { useState, useEffect } from 'react';
import { booksAPI } from '../utils/api';
import BookCard from '../components/functionalComponents/BookCard';
import { useTheme } from '../context/ThemeContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [searchNotification, setSearchNotification] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (genre) params.genre = genre;
        
        const response = await booksAPI.getAll(params);
        setBooks(response.data.books);
        
        // Show search notification
        if (search || genre) {
          const searchTerm = search ? `"${search}"` : '';
          const genreTerm = genre ? `${genre} books` : '';
          const connector = search && genre ? ' in ' : '';
          setSearchNotification(`Showing results for ${searchTerm}${connector}${genreTerm}`);
        } else {
          setSearchNotification('');
        }
        
        // Extract unique genres
        const uniqueGenres = [...new Set(response.data.books.map(book => book.genre))];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [search, genre]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  return (
    <div style={{...styles.container, backgroundColor: theme.colors.background, minHeight: '100vh'}}>
      <h1 style={{...styles.title, color: theme.colors.text}}>All Books</h1>
      
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={handleSearchChange}
          style={{...styles.searchInput, backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border}}
        />
        
        <select value={genre} onChange={handleGenreChange} style={{...styles.genreSelect, backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border}}>
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{...styles.loading, color: theme.colors.textSecondary}}>Loading books...</div>
      ) : (
        <>
          {searchNotification && (
            <div style={{...styles.notification, backgroundColor: theme.colors.secondary}}>
              {searchNotification}
            </div>
          )}
          
          <div style={{...styles.results, color: theme.colors.textSecondary}}>
            Found {books.length} book{books.length !== 1 ? 's' : ''}
          </div>
          
          {books.length > 0 ? (
            <div style={styles.booksGrid}>
              {books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div style={{...styles.noBooks, backgroundColor: theme.colors.surface, color: theme.colors.textSecondary}}>
              No books found. Try adjusting your search criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    transition: 'all 0.3s ease'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    fontWeight: '700'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: 1,
    minWidth: '300px',
    padding: '0.75rem',
    border: '2px solid',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  genreSelect: {
    padding: '0.75rem',
    border: '2px solid',
    borderRadius: '8px',
    fontSize: '1rem',
    minWidth: '150px',
    transition: 'all 0.3s ease'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem'
  },
  results: {
    marginBottom: '1rem',
    fontSize: '1rem',
    fontWeight: '500'
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  },
  noBooks: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  notification: {
    color: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '500'
  }
};

export default Books;