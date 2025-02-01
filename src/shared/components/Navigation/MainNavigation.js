import React from "react";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import "./MainNavigation.css";
import {ReactComponent as Logo} from "../../../logo.svg";

const MainNavigation = (props) => {
    return <MainHeader>
        <button className="main-navigation__menu-btn">
            <span />
            <span />
            <span />    
        </button>
        <h1 className="main-navigation__title">
            <Link to="/">
                <img src={Logo} className="App-logo" alt="Xplore" />
            </Link>
        </h1>
        <nav>

        </nav>
    </MainHeader>
}

export default MainNavigation;