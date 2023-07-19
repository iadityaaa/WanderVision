//It is the main navbar component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';//backdrop component is used to close the drawer when we click background
//IMP: ../ can be used to go one step back in a folder.
import './MainNavigation.css';

const MainNavigation = props => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    //React.Fragement just fullfills the role of a single return element in react without actually rendering any new div 
    <React.Fragment>
      {/* && means if the 1st condition is true then render the other one (its is vanila JS)*/}
      {/* MainNav is Passing closeDrawerHandler as onClick prop to backdrop */}
      {/* If drawer is open we are also rendering a backdrop component(Z index:10) under the side drawer with z index 100. */}
      {/* Backdrop is a div(vh&vw full) which lies below the drawer so that when we click on it we close the drawer. */}
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      {/* Here we are rendering SideDrawer only when the based on the value of drawerIsOpen */}
      {/* Here onclick makes sure that when we click any option in the side drawer then also the drawer closes */}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        {/* The hamburgur button is styled to go away acc to the screen size */}
        {/* When min-width<=768px button display:none and main-nav__header-nav display:block */}
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span /> {/* Span is the hamburgur style so that every span is a part of the hamburgur */}
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">WanderVision</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
