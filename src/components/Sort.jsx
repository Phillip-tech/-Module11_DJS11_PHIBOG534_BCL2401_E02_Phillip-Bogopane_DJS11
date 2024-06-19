import React, { useState } from 'react';
const genreTitleMapping = {
  1: 'Personal Growth',
  2: 'True Crime and Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};
const SearchSort = ({ searchQuery, handleSearchChange, sortBy, handleSortChange }) => {
  const [sortState, setSortState] = useState(sortBy);
  const sortShows = (criteria) => {
    setSortState(criteria);
    handleSortChange(criteria);
  };