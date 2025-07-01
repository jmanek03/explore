import React, { useState, useContext } from 'react';
import './SearchBar.css';

const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

// const ThemeToggle = () => {
//   const { theme, toggleTheme } = useTheme();
//   return (
//     <button
//       type="button"
//       className="theme-toggle-btn"
//       aria-label="Toggle light/dark mode"
//       onClick={toggleTheme}
//       title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//     >
//       {theme === 'dark' ? (
//         // Sun icon
//         <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="5.5" stroke="#fbbf24" strokeWidth="2"/>
//           <g stroke="#fbbf24" strokeWidth="2">
//             <line x1="12" y1="2" x2="12" y2="4"/>
//             <line x1="12" y1="20" x2="12" y2="22"/>
//             <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
//             <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
//             <line x1="2" y1="12" x2="4" y2="12"/>
//             <line x1="20" y1="12" x2="22" y2="12"/>
//             <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
//             <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
//           </g>
//         </svg>
//       ) : (
//         // Moon icon
//         <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
//           <path
//             d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
//             stroke="#2563eb"
//             strokeWidth="2"
//             fill="#111827"
//           />
//         </svg>
//       )}
//     </button>
//   );
// };

const SearchBar = ({ onSearch, placeholder, instant }) => {
  const [value, setValue] = useState('');

  const submitHandler = e => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const changeHandler = e => {
    setValue(e.target.value);
    if (instant) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="search-bar-row">
      <form className="search-bar" onSubmit={submitHandler}>
        <input
          className="search-bar__input"
          type="text"
          value={value}
          onChange={changeHandler}
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
    </div>
  );
};

export { ThemeContext };
export default SearchBar;
