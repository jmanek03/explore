import React, { useEffect, useState, useCallback } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Skeleton from '../../shared/components/UIElements/Skeleton';
import SearchBar, { ThemeContext } from '../../shared/components/UIElements/SearchBar';

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

  // Skeletons for user cards
  const skeletons = Array.from({ length: 3 }).map((_, idx) => (
    <li className="user-item" key={idx}>
      <div className="user-item__content" style={{ padding: 0 }}>
        <div className="user-item__image">
          <Skeleton width="4.5rem" height="4.5rem" borderRadius="50%" />
        </div>
        <div className="user-item__info" style={{ marginTop: '0.5rem' }}>
          <Skeleton
            width="7rem"
            height="1.2rem"
            borderRadius="0.5rem"
            style={{ marginBottom: '0.5rem' }}
          />
          <Skeleton width="4rem" height="1rem" borderRadius="0.5rem" />
        </div>
      </div>
    </li>
  ));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ErrorModal error={error} onClear={clearError} />
      <SearchBar onSearch={handleSearch} placeholder="Search users by name or email..." instant />
      {(isLoading || showSkeleton) && (
        <div className="center">
          <ul className="users-list">{skeletons}</ul>
        </div>
      )}
      {!isLoading && !showSkeleton && loadedUsers && <UsersList items={filteredUsers} />}
    </ThemeContext.Provider>
  );
};

export default Users;
