import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Skeleton from '../../shared/components/UIElements/Skeleton';
import SearchBar from '../../shared/components/UIElements/SearchBar';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users'
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

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
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SearchBar onSearch={setSearchTerm} placeholder="Search users by name or email..." />
      {isLoading && (
        <ul className="users-list">{skeletons}</ul>
      )}
      {!isLoading && loadedUsers && <UsersList items={filteredUsers} />}
    </React.Fragment>
  );
};

export default Users;
