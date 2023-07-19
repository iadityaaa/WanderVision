import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = props => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      {/* Modal header */}
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      {/* Wrapping the entire content in a form(not a must do) */}
      <form
      //Here we do prevent default action of the form submission so that it doesnot refreshes the page 
      //onsubmit is 1 the our written onsubmit function will take care of the prevent default inside it
        onSubmit={
          props.onSubmit ? props.onSubmit : event => event.preventDefault()
        }
      >
        {/* Modal content */}
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        {/* Modal footer */}
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
  return (
    <React.Fragment>
      {/* Below line renders the backdrop whenever modal is rendered */}
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        {/* A syntax to pass all the props received to a particular function within the component. */}
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
