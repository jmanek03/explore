import React from 'react';
import './GoogleButton.css';
import googleLogo from '../../../assets/google.svg';

const GoogleButton = ({ onClick }) => (
  <button type="button" className="google-signin-btn-pro" onClick={onClick}>
    <span className="google-signin-btn-pro__icon">
      <img src={googleLogo} alt="Google" />
    </span>
    <span className="google-signin-btn-pro__text">Google</span>
  </button>
);

export default GoogleButton;
