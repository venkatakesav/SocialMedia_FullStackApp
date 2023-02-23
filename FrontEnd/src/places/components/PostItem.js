import React from "react"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Button from "../../shared/components/FormElements/Button"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import { useContext } from "react"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import Modal from "../../shared/components/UIElements/Modal"
import "./PlaceItem.css"
import Card from "../../shared/components/UIElements/Card"
import Input from "../../shared/components/FormElements/Input"
import { useForm } from '../../shared/hooks/form-hook';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators"

function PostItem(props) {
  let pid = useParams().placeId

  const [reload, setReload] = useState(false)
  const [formState, inputHandler] = useForm(
    {
      concern: {
        value: '',
        isValid: false
      },
    },
    false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext)
  const [showConfirm, showUpdateConfirm] = useState(false);
  const [disable, setDisable] = useState(false);

  const showModal = () => {
    showUpdateConfirm(true);
  }

  const cancelModal = () => {
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

  const followHandler = async (event) => {
    event.preventDefault()
    console.log("FOLLOWING.......");
    try {
      console.log(props.id)
      await sendRequest(`http://localhost:5000/api/users/${auth.userId}`, 'PATCH', JSON.stringify({
        post_id: props.id
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
    setDisable(true)
  }

  /*Make a Upvote handler */
  const upvoteHandler = async (event) => {
    event.preventDefault()
    console.log(`http://localhost:5000/api/posts/${props.id}/upvote`);
    try {
      console.log(props.id)
      await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/${props.id}/upvote`, 'PATCH', JSON.stringify({
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
  }

  /*Make A Downvote Handler */
  const downvoteHandler = async (event) => {
    event.preventDefault()
    console.log(`http://localhost:5000/api/posts/${props.id}/downvote`);
    try {
      console.log(props.id)
      await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/${props.id}/downvote`, 'PATCH', JSON.stringify({
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
  }

  /*Add a given post to saved posts */
  const saveHandler = async (event) => {
    event.preventDefault()
    console.log("SAVING.......");
    try {
      console.log(props.id)
      await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/user_saved/saved`, 'PATCH', JSON.stringify({
        post_id: props.id
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
  }

  const reportHandler = async (event) => {
    event.preventDefault()
    console.log("REPORTING.......");
    console.log(formState.inputs.concern.value)
    try {

      console.log(props.id)
      await sendRequest(`http://localhost:5000/api/reports/${auth.userId}/${pid}`, 'POST', JSON.stringify({
        post_id: props.id,
        concern: formState.inputs.concern.value
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
  }

  const deleteSavedPost = async (event) => {
    event.preventDefault()
    console.log("DELETING.......");
    try {
      console.log(props.id)
      await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/${props.id}/delete`, 'PATCH', JSON.stringify({
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      })
    } catch (err) {
      console.log("Error")
    }
  }

  const [isLoadedPlace, setIsLoadedPlace] = useState(false);
  const [isLoadedUser, setIsLoadedUser] = useState(false);

  //Obtain the place in which the post was posted
  const [loadedPlace, setLoadedPlace] = useState();
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/${props.postedIn}`);
        setLoadedPlace(responseData.place);
        console.log(responseData.place)
        setIsLoadedPlace(true);
      } catch (err) { }
    };
    fetchPlace();
  }, [sendRequest, props.place_id]);

  //Obtain the user who posted the post
  const [loadedUser, setLoadedUser] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/users/${props.postedBy}`);
        setLoadedUser(responseData.users);
        console.log(responseData.users)
        setIsLoadedUser(true);
      } catch (err) { }
    };
    fetchUser();
  }, [sendRequest, props.postedBy]);

  //Check if the user is in the blocked list of the loaded places
  const [isBlocked, setIsBlocked] = useState(false);
  useEffect(() => {
    if (loadedPlace && loadedUser) {
      console.log(loadedPlace.blocked)
      if (loadedPlace.blocked.includes(loadedUser.id)) {
        setIsBlocked(true);
      }
    }
  }, [loadedPlace, loadedUser])


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <div className="place-item__image">
            <img src="https://media.istockphoto.com/id/1136409408/photo/close-up-view-of-a-common-octopus.jpg?s=612x612&w=0&k=20&c=PHlT9mhvOOhDf8mMmgOO-FkAf3EbpjpQtZiVFllH5P0=" alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.description}</h3>
            {/* {console.log(loadedUser)} */}
            {isBlocked && <p>Blocked User</p>}
            {!isBlocked && loadedUser && <p>{loadedUser.name}</p>}
            {loadedPlace && <p>{loadedPlace.title}</p>}
          </div>
          <div className="place-item__actions">
            {auth.userId != props.creatorId && auth.isLoggedIn && <Button onClick={upvoteHandler}>UP</Button>}
            {auth.isLoggedIn && <Button danger onClick={downvoteHandler}>DOWN</Button>}
            {auth.userId != props.postedBy && auth.isLoggedIn && <Button onClick={followHandler} disabled={disable}>FOLLOW</Button>}
            {auth.userId != props.postedBy && auth.isLoggedIn && <Button danger onClick={showModal}>REPORT</Button>}
            {/* {console.log(props.isSaved)} */}
            {props.isSaved && <Button onClick={deleteSavedPost}>DELETE</Button>}
            <Button onClick={saveHandler}>SAVE</Button>
          </div>
        </Card>
      </li>
      <Modal show={showConfirm} onCancel={cancelModal}
        header="Add Report"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelModal}>Cancel</Button>
            <Button danger disabled={!formState.isValid} onClick={reportHandler}>Confirm</Button>
          </React.Fragment>
        }>
        <form className="place-form" onSubmit={reportHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          {/* {console.log(formState.inputs)} */}
          <Input
            id="concern"
            element="text"
            type="text"
            label="Concern"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid Concern (at least 5 characters)."
            onInput={inputHandler}
          />
        </form>
      </Modal>
    </React.Fragment>
  )
}
export default PostItem