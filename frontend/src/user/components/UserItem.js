import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import { useState } from 'react';
import RelationList from './RelationList';
import RelationList_Following from './RelationList_Following';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect } from 'react';
import { useForm } from '../../shared/hooks/form-hook';

import Input from '../../shared/components/FormElements/Input';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
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
        const responseData = await sendRequest(`/api/users/${Login_user}`);
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

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: true
      },
      email: {
        value: '',
        isValid: true
      },
      age: {
        value: '',
        isValid: true
      },
      contact: {
        value: '',
        isValid: true
      }
    },
    true
  );

  const [showConfirm, showUpdateConfirm] = useState(false);

  const showModal = () => {
    showUpdateConfirm(true);
  }

  const cancelModal = () => {
    showUpdateConfirm(false);
  }

  const submit_data = async event => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!

    try {
      await sendRequest(`/api/users/update/${Login_user}`, 'PATCH', JSON.stringify({
        name: formState.inputs.name.value,
        email: formState.inputs.email.value,
        age: formState.inputs.age.value,
        contact: formState.inputs.contact.value
      }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        })
    }
    catch (err) { }

    showUpdateConfirm(false);
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
      <button onClick={showModal} className="button"
        style={{ width: "50%", marginLeft: "25%" }}>Edit User Details</button>
      {/* onSubmit={placeSubmitHandler} */}
      <div style={{ marginTop: "20px" }}>
        {showConfirm && <form className="place-form" >
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <Input
            id="age"
            element="input"
            type="text"
            label="Age"
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <Input
            id="contact"
            element="input"
            type="text"
            label="Contact"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" onClick={submit_data}>
            UPDATE USER DETAILS NOW
          </Button>
        </form>}
      </div>
    </li>
  );
};

export default UserItem;
