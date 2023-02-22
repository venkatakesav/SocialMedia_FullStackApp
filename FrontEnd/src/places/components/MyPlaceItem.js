import React, { useState, useContext } from 'react';

import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceItem.css';

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext)
  const [showConfirm, showUpdateConfirm] = useState(false);

  const showDeleteWarningHandler = () => {
    showUpdateConfirm(true);
  }

  const CancelDeleteWarningHandler = () => {
    showUpdateConfirm(false);
  }

  const confirmDeleteHandler = async () => {
    console.log("DELETING.......");
    try {
      await sendRequest(`http://localhost:5000/api/places/${props.id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
  }

  const joinSubredditHandler = async () => {
    console.log("JOINING.......");
    try {
      await sendRequest(`http://localhost:5000/api/places/${props.id}`, 'PATCH', JSON.stringify({
        userId: auth.userId
      }),
        { 'Content-Type': 'application/json' ,
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
  }

  return (
    <>
      {(!props.searchTags || props.tags.includes(props.searchTags)) && (props.title == props.searchVal || !props.searchVal) && <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <Modal show={showConfirm} onCancel={CancelDeleteWarningHandler} header="Are You Sure" footerClass="place-item__modal-actions"
          footer={
            <React.Fragment>
              <Button inverse onClick={CancelDeleteWarningHandler}>Cancel</Button>
              <Button danger onClick={confirmDeleteHandler}>Delete</Button>
            </React.Fragment>
          }>
          <h2>Are you sure, you want to Delete?</h2>
        </Modal>
        <li className="place-item">
          <Card className="place-item__content">
            {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
            <div className="place-item__image">
              <img src={props.image} alt={props.title} />
            </div>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <h3>Tags: {props.tags}</h3>
              <h3>Banned Words: {props.bannedKeyWords}</h3>
              <h3>Creation Time: {props.creationTime}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse to ={`/${props.id}/moderator`}>OPEN AS MODERATOR</Button>
            </div>
          </Card>
        </li>
      </React.Fragment>}
    </>
  );
};

export default PlaceItem;
