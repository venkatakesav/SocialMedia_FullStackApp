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
import ReportsList from '../components/ReportsList';
import Card from '../../shared/components/UIElements/Card';
import './UserPlaces.css';

// const DUMMY_REPORTS = [
//     {
//         id: 'r1',
//         reported_by: 'Reported By',
//         reported_per: 'Reported On',
//         concern: 'Concern',
//         post_id: 'Post ID',
//     },
//     {
//         id: 'r2',
//         reported_by: 'Reported By 2',
//         reported_per: 'Reported On 2',
//         concern: 'Concern 2',
//         post_id: 'Post ID 2',
//     },
//     {
//         id: 'r3',
//         reported_by: 'Reported By 3',
//         reported_per: 'Reported On 3',
//         concern: 'Concern 3',
//         post_id: 'Post ID 3',
//     }
// ]

function Moderator() {
    const auth = useContext(AuthContext);
    const Login_user = auth.userId
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const [ShowJoiningRequests, setShowJoiningRequests] = useState(false)
    const [ShowReports, setShowReports] = useState(false)
    const [loadedReports, setLoadedReports] = useState();

    const places_id = useParams().placeId

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`/api/places/${places_id}`);
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

    //Fetch Places with ID
    const [loadedFollowers, setLoadedFollowers] = useState();
    const [blockedUsers, setBlockedUsers] = useState();
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`/api/places/${places_id}`);
                setLoadedFollowers(responseData.place.followers);
                setBlockedUsers(responseData.place.blocked)
                console.log(responseData.place.followers)
                console.log(responseData.place.blocked)
            } catch (err) { }
        }; fetchPlaces()
    }, [sendRequest]);


    //For Stats and Reports Redirect to seperate pages

    //Use Useeffect to fetch reports data from backend
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const responseData = await sendRequest(`/api/reports/${auth.userId}/${places_id}`, 'GET', null, {});
                setLoadedReports(responseData.reports);
                console.log(responseData.reports)
            } catch (err) { }
        }; fetchReports()
    }, [sendRequest]);


    return (
        <React.Fragment>
            <div className='center'>
                <Button inverse onClick={openModalUsers}>Users</Button>
                <Button inverse onClick={openModalJoiningRequests}>Joining Requests</Button>
                <Button inverse >Status</Button>
                <Button inverse >Reports Page</Button>
            </div>
            <ReportsList items={loadedReports}></ReportsList>
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
                <UserMod items={loadedFollowers} blockedUsers={blockedUsers}></UserMod>
            </Modal>
        </React.Fragment>
    )
}
export default Moderator