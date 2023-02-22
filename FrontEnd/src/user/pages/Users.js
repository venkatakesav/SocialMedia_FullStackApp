import React, { useEffect } from 'react';
import UsersList from '../components/UsersList';
import { useState, useContext } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Users = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const Login_user = auth.userId

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/users/${Login_user}`);
        setLoadedUsers(responseData.users);
      } catch (err) { }
    }; fetchUsers()
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>)}
      {!isLoading && loadedUsers &&<UsersList items={loadedUsers}></UsersList>}
    </React.Fragment>
  )
};

export default Users;
