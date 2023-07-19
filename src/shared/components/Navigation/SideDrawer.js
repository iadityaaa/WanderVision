import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
// npm install --save react-transition-group
// It is a library that allows us to do animation if we add, remove an item from dom or render it.
//It contains CSSTransition component which allows to perform animations
import './SideDrawer.css';
const SideDrawer = props => {
  const content = (
    //We can do all the things with jsx that we can do with js like storing it in a variable
    <CSSTransition
      //Show prop passed from MainNav to tell us wheter to render the component or not
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      {/* aside is a normal tag which is styled using the given classname */}
      {/* Here onclick prop is the closeDrawerHandler which will close the drawer when we click on any of the link */}
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );

  //Portal is a package inside ReactDom from 'react-dom' which allows us to redent a component to a particular dom element instead of its original place.
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
  //Drawer is rendered above the root element in index.html
};

export default SideDrawer;
