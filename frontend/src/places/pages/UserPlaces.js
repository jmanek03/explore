import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Skeleton from '../../shared/components/UIElements/Skeleton';
import SearchBar from '../../shared/components/UIElements/SearchBar';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

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
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SearchBar onSearch={setSearchTerm} placeholder="Search places by title, description, or address..." />
      {isLoading && (
        <ul className="place-list">{skeletons}</ul>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={filteredPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
