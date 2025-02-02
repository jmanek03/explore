import React, { useState } from "react";
import ErrorBoundary from "../UIElements/ErrorBoundary"; // Import ErrorBoundary
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import "./MainNavigation.css";
import {ReactComponent as Logo} from "../../../logo.svg";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = (props) => {
    const[drawerIsOpen,setDrawerIsOpen]=useState(false);

    const openDrawerHandler = () => {
        setDrawerIsOpen(true);
    }

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false);
    }

    return ( 
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
            <ErrorBoundary>
                <SideDrawer show = {drawerIsOpen} onClick={closeDrawerHandler}>
                    <nav className="main-navigation__drawer-nav">
                        <NavLinks />
                    </nav>
                </SideDrawer>
            </ErrorBoundary>
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
                    <span />
                    <span />
                    <span />    
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">
                        <Logo className="App-logo" alt="Xplore" />
                    </Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
        )
};

export default MainNavigation;