import React, { useRef } from "react";
import './SideDrawer.css';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

const SideDrawer = (props) => {
    const nodeRef = useRef(null); // Create a ref for the aside element

    const content = (
        <CSSTransition 
            in={props.show} 
            timeout={200} 
            classNames="slide-in-left" 
            mountOnEnter 
            unmountOnExit
            nodeRef={nodeRef} // Use the ref here
        >
            <aside ref={nodeRef} className="side-drawer" onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>
    );

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
}

export default SideDrawer;
