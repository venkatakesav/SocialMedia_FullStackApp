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

function Saved_Posts() {
    const place_id = useParams().placeId
    const [loadedPosts, setLoadedPosts] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext)
    const [reload, setReload] = useState(false)

    const [showConfirm, showUpdateConfirm] = useState(false);

    useEffect(() => {
        const fetchPosts_saved = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/user_saved/saved`)
                setLoadedPosts(responseData.posts)
            } catch (err) {
            };
        }; fetchPosts_saved()
        setReload(false)
    }, [sendRequest, place_id, reload])

    console.log(auth.token)

    const showModal = () => {
        showUpdateConfirm(true);
    }

    const cancelModal = () => {
        showUpdateConfirm(false);
    }

    console.log(loadedPosts)

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <div className='center'><LoadingSpinner></LoadingSpinner></div>}
        {!isLoading && loadedPosts && <PostList items={loadedPosts} user__id={auth.userId} place__id={place_id} />}
        {console.log(`http://localhost:5000/api/posts/${auth.userId}/user_saved/saved`)}
    </React.Fragment>;
}
export default Saved_Posts