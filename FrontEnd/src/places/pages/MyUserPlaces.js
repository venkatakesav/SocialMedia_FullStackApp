import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import MyPlaceList from '../components/MyPlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { InputBase } from '@mui/material';
import Button from '../../shared/components/FormElements/Button';
import './UserPlaces.css';


const MyUserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchPlace, setSearchPlace] = useState();
  const [searchTags, setSearchTags] = useState();
  const [isAscending, setIsAscending] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [isFollowers, setIsFollowers] = useState(false);
  const [isCreationDate, setIsCreationDate] = useState(false);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/users/${userId}/my`)
        setLoadedPlaces(responseData.places_user)
      } catch (err) {
      };
    }; fetchPlaces()
  }, [sendRequest, userId])

  {console.log(loadedPlaces)}

  const searchPlaceHandler = event => {
    setSearchPlace(event.target.value)
    console.log(searchPlace)
  }

  const searchTagsHandler = event => {
    setSearchTags(event.target.value)
    console.log(searchTags)  
  }

  const[finalTags, setFinalTags] = useState();
  const setFinalTags_1 = () => {
    setFinalTags(searchTags.split(','))
    console.log(finalTags)
  }

  const setAscending_confirm = () => {
    setIsAscending(true)
    setIsDescending(false)
    setIsFollowers(false)
    setIsCreationDate(false)
  }

  const setDescending_confirm = () => {
    setIsAscending(false)
    setIsDescending(true)
    setIsFollowers(false)
    setIsCreationDate(false)
  }

  const setFollowers_confirm = () => {
    setIsAscending(false)
    setIsDescending(false)
    setIsFollowers(true)
    setIsCreationDate(false)
  }

  const setCreationDate_confirm = () => {
    setIsAscending(false)
    setIsDescending(false)
    setIsFollowers(false)
    setIsCreationDate(true)
  }

  // console.log()

  return <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && <div className='center'><LoadingSpinner></LoadingSpinner></div>}
    <div><input type="text"
      value={searchPlace} onChange={searchPlaceHandler}
    ></input><Button type="submit">Search Name</Button></div>
    <div><input type="text" onChange={searchTagsHandler}></input><Button type="submit" onClick={setFinalTags_1}>Search Tags!!</Button></div>
    <div className='InLine'>
      <Button inverse onClick={setAscending_confirm}>Ascending</Button>
      <Button inverse onClick={setFollowers_confirm}>Followers</Button>
      <Button inverse onClick={setDescending_confirm}>Descending</Button>
      <Button inverse onClick={setCreationDate_confirm}>Creation Date</Button></div>
    {!isLoading && loadedPlaces && <MyPlaceList items={loadedPlaces} searchVal={searchPlace} searchTags={finalTags}
    isAscending={isAscending} isFollowers={isFollowers} isDescending={isDescending} isCreationDate={isCreationDate}
    />}
    {console.log(`http://localhost:5000/api/places/users/${userId}`)}
  </React.Fragment>;

// onClick={setIsAscending(true)}
};

export default MyUserPlaces;
