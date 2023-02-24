import React from "react"
import RelationItem_Following from "./RelationItem_Following"
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect, useState } from 'react';

function RelationList(props) {

    if (props.items.length === 0) {
        return (
            <h2>No Followers Found!!!</h2>
        )
    }

    return (
        <ul>
            {console.log(props.items.following)}
            {props.items.following.map((element) => {
                return <RelationItem_Following following={element}
                    key={element.id}
                />
            })}
        </ul>
    )
}
export default RelationList