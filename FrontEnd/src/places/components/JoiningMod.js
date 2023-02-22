import React from "react"
import JoiningModItem from "./JoiningModItem";
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect, useState } from 'react';

function RelationList(props) {

    // if (props.items.length === 0) {
    //     return (
    //         <h2>No Followers Found!!!</h2>
    //     )
    // }

    return (
        <ul>
            {console.log(props.items.requests)}
            {props.items.requests.map((element) => {
                return <JoiningModItem users={element}
                    key={element.id}
                />
            })} 
            <JoiningModItem></JoiningModItem>
        </ul>
    )
}
export default RelationList