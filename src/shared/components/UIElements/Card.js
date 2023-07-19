import React from 'react';

import './Card.css';

const Card = props => {
  return (
    <div className={`card ${props.className}` /* style={props.style}*/}>
      {/* Export all the content withing the opening and closing tags of the card component using props.children */}
      {props.children}
    </div>
  );
};

export default Card;
