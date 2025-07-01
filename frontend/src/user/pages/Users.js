import React, { useEffect, useState, useCallback } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Skeleton from '../../shared/components/UIElements/Skeleton';
import SearchBar, { ThemeContext } from '../../shared/components/UIElements/SearchBar';
import ThemeToggle from '../../shared/components/UIElements/ThemeToggle';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.body.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    let timeout;
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users'
        );
        setLoadedUsers(responseData.users);
        // Keep skeleton for at least 800ms
        timeout = setTimeout(() => setShowSkeleton(false), 1000);
      } catch (err) {
        setShowSkeleton(false);
      }
    };
    fetchUsers();
    return () => clearTimeout(timeout);
  }, [sendRequest]);

  // Filter as you type (not just on submit)
  const handleSearch = value => setSearchTerm(value);

  const filteredUsers = loadedUsers
    ? loadedUsers.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Improved skeletons for user cards
  const skeletons = Array.from({ length: 3 }).map((_, idx) => (
    <li className="user-item" key={idx}>
      <div className="user-item__content">
        <div className="user-item__image">
          <Skeleton width="4rem" height="4rem" borderRadius="50%" />
        </div>
        <div className="user-item__info">
          <Skeleton
            width="7rem"
            height="1.1rem"
            borderRadius="0.5rem"
            style={{ marginBottom: '0.4rem' }}
          />
          <Skeleton width="4.5rem" height="0.9rem" borderRadius="0.5rem" />
        </div>
      </div>
    </li>
  ));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ErrorModal error={error} onClear={clearError} />
      <div className="users-header-row">
        <div className="users-header-row__toggle">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <div className="users-header-row__search">
          <SearchBar onSearch={handleSearch} placeholder="Search users by name or email..." instant />
        </div>
      </div>
      {(isLoading || showSkeleton) && (
        <div className="center">
          <ul className="users-list fade-in">{skeletons}</ul>
        </div>
      )}
      {!isLoading && !showSkeleton && loadedUsers && (
        <div className="fade-in">
          <UsersList items={filteredUsers} />
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export default Users;
