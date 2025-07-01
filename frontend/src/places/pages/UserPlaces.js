import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Skeleton from '../../shared/components/UIElements/Skeleton';
import SearchBar, { ThemeContext } from '../../shared/components/UIElements/SearchBar';
import ThemeToggle from '../../shared/components/UIElements/ThemeToggle';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

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
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
        // Keep skeleton for at least 800ms
        timeout = setTimeout(() => setShowSkeleton(false), 1000);
      } catch (err) {
        setShowSkeleton(false);
      }
    };
    fetchPlaces();
    return () => clearTimeout(timeout);
  }, [sendRequest, userId]);

  // Filter as you type (not just on submit)
  const handleSearch = value => setSearchTerm(value);

  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };

  const filteredPlaces = loadedPlaces
    ? loadedPlaces.filter(
        place =>
          place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Skeletons for place cards
  const skeletons = Array.from({ length: 2 }).map((_, idx) => (
    <li className="place-item" key={idx}>
      <div className="place-item__content" style={{ padding: 0 }}>
        <div className="place-item__image">
          <Skeleton width="100%" height="12rem" borderRadius="1rem" />
        </div>
        <div className="place-item__info" style={{ marginTop: '1rem' }}>
          <Skeleton
            width="60%"
            height="1.3rem"
            borderRadius="0.5rem"
            style={{ marginBottom: '0.5rem' }}
          />
          <Skeleton
            width="40%"
            height="1rem"
            borderRadius="0.5rem"
            style={{ marginBottom: '0.5rem' }}
          />
          <Skeleton width="90%" height="0.9rem" borderRadius="0.5rem" />
        </div>
        <div
          className="place-item__actions"
          style={{
            marginTop: '1rem',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <Skeleton width="5rem" height="2rem" borderRadius="0.5rem" />
          <Skeleton width="5rem" height="2rem" borderRadius="0.5rem" />
        </div>
      </div>
    </li>
  ));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ErrorModal error={error} onClear={clearError} />
      <div style={{ position: 'relative', minHeight: '3.5rem' }}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search places by title, description, or address..." instant />
        </div>
      </div>
      {(isLoading || showSkeleton) && (
        <div className="center">
          <ul className="place-list fade-in">{skeletons}</ul>
        </div>
      )}
      {!isLoading && !showSkeleton && loadedPlaces && (
        <div className="fade-in">
          <PlaceList items={filteredPlaces} onDeletePlace={placeDeletedHandler} />
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export default UserPlaces;
