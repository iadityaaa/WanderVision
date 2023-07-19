import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'; //React NavLink helps to colour diff links so as to show user which page we are actually on

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        {/* Can be accessed for styling as anchor */}
        <NavLink to="/" exact> 
        {/* If you will not give exact here, then sabhi path / se shuru hote hain so harsmy ye active rhega */}
          ALL USERS
        </NavLink>
      </li>
      {/* Redering the different li based on authentication status */}
      {auth.isLoggedIn && (
        <li>
          {/* Note: abi yahan navbar ka MYplaces pe click krne pe kewal u1 ka places hi render hoga */}
          <NavLink to={`${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
