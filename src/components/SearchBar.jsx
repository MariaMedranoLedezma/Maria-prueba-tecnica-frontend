import React from 'react';
import '../css/SearchBar.css';

function SearchBar({ query, setQuery }) {
  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        placeholder="🔍 Buscar personaje..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar-input"
      />
    </div>
  );
}

export default SearchBar;
