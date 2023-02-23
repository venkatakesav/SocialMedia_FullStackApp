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

function ReportItem(props) {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext)
    const [showConfirm, showUpdateConfirm] = useState(false);
    const [disable, setDisable] = useState(false);

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

    const setIgnore = async (event) => {
        event.preventDefault()
        console.log("IGNORING.......");
        try {
            await sendRequest(`http://localhost:5000/api/reports/${props.id}`, 'PATCH', JSON.stringify({}), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            })
        } catch (err) {
            console.log("Error")
        }
    }

    const [isBlocked, setIsBlocked] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let countdownInterval;
        if (countdown > 0) {
            countdownInterval = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0 && isBlocked) {
            // block the user
            console.log("BLOCKING.......");
            const blockUser = async () => {
                try {
                    console.log(`http://localhost:5000/api/places/${props.reported_per}/block`)
                    await sendRequest(`http://localhost:5000/api/places/${props.reported_per}/block`, 'PATCH', JSON.stringify({
                        userId: props.reported_per,
                        placeId: loadedPost.place_id
                    }), {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    });
                    console.log('User is blocked!');
                } catch (err) {
                    console.log("Error")
                }
            }
            blockUser();
        }
        return () => clearTimeout(countdownInterval);
    }, [countdown, isBlocked]);

    const handleBlockClick = () => {
        setIsBlocked(true);
        setCountdown(3);
    };

    const handleCancelClick = () => {
        setIsBlocked(false);
        setCountdown(0);
    };

    //Place a get request to get the user details
    const [loadedUser, setLoadedUser] = useState();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/users/${props.reported_by}`);
                setLoadedUser(responseData.users);
                console.log(responseData.users)
            } catch (err) { }
        };
        fetchUser();
    }, [sendRequest, props.reported_by]);

    //Repeat same for the reported person
    const [loadedReportedUser, setLoadedReportedUser] = useState();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/users/${props.reported_per}`);
                setLoadedReportedUser(responseData.users);
                console.log(responseData.users)
            } catch (err) { }
        };
        fetchUser();
    }, [sendRequest, props.reported_per]);

    //Repeat Same for the post
    const [loadedPost, setLoadedPost] = useState();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/posts/${props.post_id}`);
                setLoadedPost(responseData.post);
            } catch (err) { }
        };
        fetchPost();
    }, [sendRequest, props.post_id]);

    // console.log(loadedUser)
    // console.log(loadedReportedUser)
    console.log(loadedPost)

    //Delete the post
    const deletePost = async (event) => {
        event.preventDefault()
        console.log("DELETING.......");
        try {
            await sendRequest(`http://localhost:5000/api/posts/${auth.userId}/${props.post_id}`, 'DELETE', null, {
                //Add Authorization header
                Authorization: 'Bearer ' + auth.token

            })
        } catch (err) {
            console.log("Error")
        }

        console.log("DELETING REPORT.......");
        try {
            await sendRequest(`http://localhost:5000/api/reports/${props.id}`, 'DELETE', null, {})
        }
        catch (err) {
            console.log("Error")
        }
    }

    //Block the User
    const blockUser = async (event) => {
        event.preventDefault()
        console.log("BLOCKING.......");
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.reported_per}/block`, 'PATCH', JSON.stringify({
                userId: props.reported_per,
                placeId: loadedPost.place_id
            }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            })
        }
        catch (err) {
            console.log("Error")
        }
    }


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
                        {loadedUser && <h2>Name: {loadedUser.name}</h2>}
                        {loadedReportedUser && <h3>Name Of Reported: {loadedReportedUser.name}</h3>}
                        <h3>Concern: {props.concern}</h3>
                        {loadedPost && <h3>LoadedPost Title :{loadedPost.title}</h3>}
                    </div>
                    <div className="place-item__actions">
                        {isBlocked ? (
                            <Button onClick={handleCancelClick} disabled={props.isIgnored}>Cancel in {countdown} secs</Button>
                        ) : (
                            <Button onClick={handleBlockClick} disabled={props.isIgnored}>BLOCK</Button>
                        )}
                        <Button danger onClick={deletePost}>DELETE</Button>
                        <Button inverse onClick={setIgnore}>IGNORE</Button>
                    </div>
                </Card>
            </li>
        </React.Fragment>
        // <p>Hello World</p>
    )
}
export default ReportItem