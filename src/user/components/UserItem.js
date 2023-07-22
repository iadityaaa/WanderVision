import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

// different Props like id,image,name,Placecount will be passed from the UserList component
const UserItem = props => { 
  return (
    <li className="user-item">
      {/* We create a card component and style it and export all the content withing the tags using props.children */}
      <Card className="user-item__content">
        {/* Use Link from (RRD) so that it doesnot actually redirects but managed within the RRD */}
         <Link to={`/${props.id}/places`}> {/* Passing custom url path to Link */}

         {/* Nothing happens now because no such places path is available */}

          <div className="user-item__image">
            {/* Avatar is a dynamic image component */}
            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {/* Passing Checking placecount and Outputting place/s as dynamic value */}
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'} 
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
