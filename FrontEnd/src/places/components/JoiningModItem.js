import React from "react"

import Button from "../../shared/components/FormElements/Button"
import "./JoiningModItem.css"
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

function JoiningModItem(props) {

    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();
    const Login_user = props.users
    console.log(props.users)

    const places_id = useParams().placeId

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/users/${Login_user}`);
                setLoadedUsers(responseData.users);
            } catch (err) { }
        }; fetchUsers()
    }, [sendRequest]);

    const acceptHandler = async () => {
        try {
            console.log(
                `http://localhost:5000/api/places/accept/${places_id}`
            )
            await sendRequest(
                `http://localhost:5000/api/places/accept/${places_id}`,
                'PATCH',
                JSON.stringify({
                    userId: Login_user,
                }),
                {
                    'Content-Type': 'application/json',
                }
            );

            console.log(Login_user)
        } catch (err) {
            console.log(err)
        }
    }

    const rejectHandler = async () => {
        try {
            await sendRequest(
                `http://localhost:5000/api/places/reject/${places_id}`,
                'PATCH',
                JSON.stringify({
                    userId: Login_user,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='Test'>
            {loadedUsers &&
                <React.Fragment>
                    <p>{loadedUsers.name}</p>
                    <div className="button-div">
                        <Button inverse onClick={rejectHandler}>REJECT</Button>
                        <Button inverse onClick={acceptHandler}>ACCEPT</Button>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}
export default JoiningModItem