import React from "react"

import Button from "../../shared/components/FormElements/Button"
import "./RelationItem.css"
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect, useState } from 'react';

function RelationItem(props) {

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const Login_user = props.followers

  const remove_user_handler = async () => {
    console.log(loadedUsers.id)
    try {
      const responseData = await sendRequest(`http://localhost:5000/api/users/remove/${auth.userId}`, 'PATCH', JSON.stringify({
        user_to_remove: loadedUsers.id
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      });
      console.log(responseData)
    } catch (err) {
      console.log("error")
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/users/${Login_user}`);
        setLoadedUsers(responseData.users);
        console.log(responseData.users)
      } catch (err) { }
    }; fetchUsers()
  }, [sendRequest]);
  

  return (
    <div className='Test'>
      {console.log(loadedUsers)}
      {loadedUsers && <p>{loadedUsers.name}</p>}
      <Button inverse onClick={remove_user_handler}>REMOVE</Button></div>
  )
}
export default RelationItem