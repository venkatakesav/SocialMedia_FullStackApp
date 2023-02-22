import React from "react"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import { useContext } from "react"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import Button from "../../shared/components/FormElements/Button"
import { useForm } from '../../shared/hooks/form-hook';
import Input from "../../shared/components/FormElements/Input"
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators"
import Modal from "../../shared/components/UIElements/Modal"

import PostList from "../components/PostList"

import "./UserPlaces.css"

function Posts() {
    const place_id = useParams().placeId
    const [loadedPosts, setLoadedPosts] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext)
    const [reload, setReload] = useState(false)

    const [showConfirm, showUpdateConfirm] = useState(false);

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
        },
        false
    );

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/${place_id}`)
                setLoadedPosts(responseData.posts)
            } catch (err) {
            };
        }; fetchPlaces()
        setReload(false)
    }, [sendRequest, place_id, reload])

    // { console.log(loadedPosts) }

    const placeSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs); // send this to the backend!
        try {
            await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/${place_id}`, 'POST', JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            })
        } //Redirect the User to a seperate page
        catch (err) { }
        setReload(true)
    };

    const showModal = () => {
        showUpdateConfirm(true);
    }

    const cancelModal = () => {
        showUpdateConfirm(false);
    }

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <div className='center'><LoadingSpinner></LoadingSpinner></div>}
        <Modal show={showConfirm} onCancel={cancelModal}
            header="Add Post"
            footerClass="place-item__modal-actions"
            footer={
                <React.Fragment>
                    <Button inverse onClick={cancelModal}>Cancel</Button>
                    <Button danger disabled={!formState.isValid} onClick={placeSubmitHandler}>Confirm</Button>
                </React.Fragment>
            }>
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="text"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="text"
                    type="text"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
            </form>
        </Modal>
        <button onClick={showModal} className="button"
            style={{ width: "50%", marginLeft: "25%" }}>New Post</button>
        {!isLoading && loadedPosts && <PostList items={loadedPosts} user__id={auth.userId} place__id={place_id} />}
        {console.log(`http://localhost:5000/api/posts/${auth.userId}/${place_id}`)}
    </React.Fragment>;
}
export default Posts