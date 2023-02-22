import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import MyPlaceItem from './MyPlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const MyPlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No SubGreddit found. Maybe create one?</h2>
          <Button to="/places/new">Create SubGreddit</Button>
        </Card>
      </div>
    );
  }

  {props.isAscending && props.items.sort((a, b) => (a.title > b.title) ? 1 : -1)}
  {props.isDescending && props.items.sort((a, b) => (a.title > b.title) ? -1 : 1)}
  {props.isCreationDate && props.items.sort((a, b) => (a.creation_date > b.creation_date) ? -1 : 1)}


  return (
    <ul className="place-list">
      {props.items.map(place => (
        <MyPlaceItem
          key={place.id}
          id={place.id}
          image={place.img}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          creationTime = {place.creation_date}
          tags={place.tags}
          bannedKeyWords={place.bannedKeyWords}
          searchVal = {props.searchVal}
          searchTags = {props.searchTags}
        />
      ))}
    </ul>
  );
};

export default MyPlaceList;
