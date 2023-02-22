import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import { useState } from 'react';
import RelationList from './RelationList';
import RelationList_Following from './RelationList_Following';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import {useContext, useEffect} from 'react';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import './UserItem.css';

const UserItem = props => {
  //Basically within the User Item component
  //We are going to have to links followers
  //and following

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const Login_user = auth.userId

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/users/${Login_user}`);
        setLoadedUsers(responseData.users);
        console.log(responseData.users)
      } catch (err) { }
    }; fetchUsers()
  }, [sendRequest]);

  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  const openModalFollowers = () => {
    setShowFollowers(true)
  }

  const openModalFollowing = () => {
    setShowFollowing(true)
  }

  const closeModalFollowers = () => {
    setShowFollowers(false)
  }

  const closeModalFollowing = () => {
    setShowFollowing(false)
  }

  return (
    <li className="user-item">
      <Modal show={showFollowers} 
      header="Followers"
      contentClass="place-item__modal-content" 
      footerClass="place-item__modal-actions" 
      footer={<Button onClick={closeModalFollowers}>CLOSE</Button>}>
        <RelationList items={loadedUsers}></RelationList>
      </Modal>
      <Modal show={showFollowing} 
      header="Following"
      contentClass="place-item__modal-content" 
      footerClass="place-item__modal-actions" 
      footer={<Button onClick={closeModalFollowing}>CLOSE</Button>}>
        <RelationList_Following items={loadedUsers}></RelationList_Following>
      </Modal>
      <Card>
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
        <Button default onClick={openModalFollowers}>Followers</Button>
        <Button default onClick={openModalFollowing}>Following</Button>
      </Card>
    </li>
  );
};

export default UserItem;
