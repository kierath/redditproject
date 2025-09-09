import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchBar.css';

export const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');
  const [sort, setSort] = useState('relevance');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!term.trim()) return;

    // Always navigate to /search with updated params
    const searchParams = new URLSearchParams({ q: term, sort });
    navigate(`/search?${searchParams.toString()}`);

    // Still call onSearch immediately so results show without refresh
    onSearch({ query: term, sort });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);

    if (term.trim()) {
      // Navigate with updated sort
      const searchParams = new URLSearchParams({ q: term, sort: newSort });
      navigate(`/search?${searchParams.toString()}`);
      onSearch({ query: term, sort: newSort });
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search Reddit..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="button" onClick={handleSearch}>
        Search
      </button>
      <select value={sort} onChange={handleSortChange}>
        <option value="relevance">Relevance</option>
        <option value="hot">Hot</option>
        <option value="new">New</option>
        <option value="top">Top</option>
      </select>
    </div>
  );
};
