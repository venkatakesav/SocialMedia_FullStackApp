import React from "react"

import Button from "../../shared/components/FormElements/Button"
import "./RelationItem.css"
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect, useState } from 'react';
import Sub_Paragraph from "./Sub_Paragraph";

function RelationItem(props) {

    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();
    const Login_user = props.following
    console.log(props.following)

    const unfollow_user_handler = async () => {
        console.log(loadedUsers.id)
        try{
            const responseData = await sendRequest(`http://localhost:5000/api/users/unfollow/${auth.userId}`, 'PATCH', JSON.stringify({
                user_to_unfollow: loadedUsers.id
            }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            });
            console.log(responseData)
        }catch(err){
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

    console.log(loadedUsers)

    return (
        <div className='Test'>
            {loadedUsers && <p>{loadedUsers.name}</p>}
            <Button inverse onClick={unfollow_user_handler}>REMOVE</Button>
            </div>
    )
}
export default RelationItem