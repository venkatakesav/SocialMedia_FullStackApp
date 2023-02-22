import React from "react"
import RelationItem from "./RelationItem"
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect, useState } from 'react';

function RelationList(props) {

  if (props.items.length === 0) {
    return (
      <h2>You aren't Following anyone!!</h2>
    )
  }

  return (
    <ul>
      {
        props.items.followers.map((element) => {
          return <RelationItem followers={element}
            key={element.id}
          />
        })
      }

    </ul>
  )
}
export default RelationList