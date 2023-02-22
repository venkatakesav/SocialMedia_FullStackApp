import React from "react";
import { Link } from "react-router-dom";

function UserMod(props) {

    if (props.items.length === 0) {
        return (
            <h2>No Followers Found!!!</h2>
        )
    }

    return (
        <ul>
            {/* {console.log(props.items.following)}
            {props.items.following.map((element) => {
                return <RelationItem_Following following={element}
                    key={element.id}
                />
            })} */}
            {console.log(props.items)}
            <li>Hello</li>
        </ul>
    )
}
export default UserMod