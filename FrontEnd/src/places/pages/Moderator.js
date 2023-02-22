import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { InputBase } from '@mui/material';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext } from 'react';
import Modal from '../../shared/components/UIElements/Modal';
import { Link } from 'react-router-dom';
import UserMod from '../components/UserMod';
import JoiningMod from '../components/JoiningMod';
import './UserPlaces.css';

function Moderator() {
    const auth = useContext(AuthContext);
    const Login_user = auth.userId
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const [ShowJoiningRequests, setShowJoiningRequests] = useState(false)

    const places_id = useParams().placeId

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/${places_id}`);
                setLoadedPlace(responseData.place);
                console.log(responseData.place)
            } catch (err) { }
        }; fetchPlaces()
    }, [sendRequest]);

    const openModalJoiningRequests = () => {
        setShowJoiningRequests(true)
    }

    const closeModalJoiningRequests = () => {
        setShowJoiningRequests(false)
    }

    const openModalUsers = () => {
        setShowUsers(true)
    }

    const closeModalUsers = () => {
        setShowUsers(false)
    }

    const [showUsers, setShowUsers] = useState(false)

    //For Stats and Reports Redirect to seperate pages

    return (
        <React.Fragment>
            <div className='center'>
                <Button inverse onClick={openModalUsers}>Users</Button>
                <Button inverse onClick={openModalJoiningRequests}>Joining Requests</Button>
                <Button inverse >Status</Button>
                <Button inverse >Reports Page</Button>
            </div>
            <Modal show={ShowJoiningRequests}
                header="Joining Requests"
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeModalJoiningRequests}>CLOSE</Button>}
            >
                <JoiningMod items={loadedPlace}></JoiningMod>   
            </Modal>
            <Modal show={showUsers}
                header="Users"
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeModalUsers}>CLOSE</Button>}
            >
                {/* <UserMod items={loadedPlace}></UserMod> */}
            </Modal>
        </React.Fragment>
    )
}
export default Moderator