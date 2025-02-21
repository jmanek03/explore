import React from "react";
import { AuthContext } from "../../context/auth-context";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = React.useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/u1/places" exact>
            MY PLACES
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && <li>
        <NavLink to="/places/new" exact>
          NEW PLACE
        </NavLink>
      </li>}
      {!auth.isLoggedIn && <li>
        <NavLink to="/auth" exact>
          LOGIN
        </NavLink>
      </li>}
    </ul>
  );
};

export default NavLinks;
