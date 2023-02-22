import React from "react"

import Button from "../../shared/components/FormElements/Button"
import "./RelationItem.css"
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext, useEffect, useState } from 'react';

function Sub_Paragraph(props) {
    return (
        <p>{props.name}</p>
    )
}

export default Sub_Paragraph