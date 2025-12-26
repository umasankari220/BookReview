import React, { createContext, useContext, useState } from 'react';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState({ books: 0, reviews: 0, users: 0 });

  const updateStats = (newStats) => {
    setStats(newStats);
  };

  const incrementReviews = () => {
    setStats(prev => ({ ...prev, reviews: prev.reviews + 1 }));
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats, incrementReviews }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
};