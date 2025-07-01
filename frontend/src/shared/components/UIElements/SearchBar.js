import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder }) => {
  const [value, setValue] = useState('');

  const submitHandler = e => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className="search-bar" onSubmit={submitHandler}>
      <input
        className="search-bar__input"
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder || 'Search users or places...'}
        aria-label="Search"
      />
      <button className="search-bar__button" type="submit">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="#2563eb" strokeWidth="2"/>
          <path stroke="#2563eb" strokeWidth="2" strokeLinecap="round" d="M20 20l-3.5-3.5"/>
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
