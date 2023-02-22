import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext } from 'react';

const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();

  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      tags: {
        value: '',
        isValid: false
      },
      bannedKeyWords: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
        setLoadedPlace(response.place)
        if (response.place) {
          setFormData(
            {
              title: {
                value: response.place.title,
                isValid: true
              },
              description: {
                value: response.place.description,
                isValid: true
              },
              tags: {
                value: response.place.tags,
                isValid: true
              },
              bannedKeyWords: {
                value: response.place.bannedKeyWords,
                isValid: true
              }
            },
            true
          );
        }
      }
      catch (err) { }
    }
    fetchPlace()
  }, [sendRequest, placeId, setFormData])


  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          tags: formState.inputs.tags.value,
          bannedKeyWords: formState.inputs.bannedKeyWords.value
        }),
        { 'Content-Type': 'application/json' ,
        Authorization: 'Bearer ' + auth.token
      })
    } catch {
    }
  };

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Input
          id="tags"
          element="textarea"
          label="Tags"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid set of tags (with , s)."
          onInput={inputHandler}
        />
        <Input
          id="bannedKeyWords"
          element="textarea"
          label="Banned KeyWords"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid set of Banned KeyWords (with , s)."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>}
    </React.Fragment>
  );
};

export default UpdatePlace;
