import React from 'react'
import UsersList from '../components/UsersList'

const Users= () => {
  const USERS = [
    {
      id: "1",
      name: "Jay Manek",
      image:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      places: 3,
    },
  ];
  return <UsersList items={USERS}/>
}
export default Users;
