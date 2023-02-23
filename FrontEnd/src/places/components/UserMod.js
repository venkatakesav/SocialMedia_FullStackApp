import React from "react";
import { Link } from "react-router-dom";

function UserMod(props) {

    if (props.items.length === 0 || props.blockedUsers.length === 0) {
        return (
            <h2>No Followers Found!!!</h2>
        )
    }

    return (
        <ul>
            {
                props.items.map((element) => {
                    return <p>{element}</p> //All Users -> Including Blocked
                })
            }
            {
                props.blockedUsers.map((element) => {
                    return <p style={{color : "red"}}>{element}</p> //Blocked Users
                })
            }
        </ul>
    )
}
export default UserMod