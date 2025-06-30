import React, { useState, useContext, useEffect } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import PasswordInput from '../../shared/components/FormElements/PasswordInput';
import GoogleButton from '../../shared/components/FormElements/GoogleButton';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  // Google OAuth: handle redirect with token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    if (token && userId) {
      auth.login(userId, token);
      window.history.replaceState({}, document.title, window.location.pathname); // Clean up URL
    }
  }, [auth]);

  // Only allow switching via link, not button
  const switchModeHandler = (e) => {
    e.preventDefault();
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/users/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-form-section">
        <Card className="authentication auth-card small-font">
          <h2 className="authentication__header">{isLoginMode ? 'Login to Xplore' : 'Sign Up for Xplore'}</h2>
          <p className="authentication__subtitle">
            {isLoginMode ? 'Welcome back! Please login to continue.' : 'Create your account to start exploring.'}
          </p>
          <GoogleButton onClick={handleGoogleSignIn} />
          <div className="auth-divider">
            <span>or</span>
          </div>
          <ErrorModal error={error} onClear={clearError} />
          {isLoading && <LoadingSpinner asOverlay />}
          <form onSubmit={authSubmitHandler} className="auth-form">
            {!isLoginMode && (
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
                placeholder="Enter your name"
              />
            )}
            {!isLoginMode && (
              <div className="image-upload-row">
                <ImageUpload
                  center
                  id="image"
                  onInput={inputHandler}
                  errorText="Please provide an image."
                  inline
                />
              </div>
            )}
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
              placeholder="Enter your email"
            />
            <PasswordInput
              id="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password, at least 6 characters."
              onInput={inputHandler}
              placeholder="Enter your password"
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? 'LOGIN' : 'SIGNUP'}
            </Button>
          </form>
          <div className="auth-bottom-link">
            {isLoginMode ? (
              <span>
                Not a member?{' '}
                <a href="#" className="auth-link" onClick={switchModeHandler}>
                  Sign up
                </a>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <a href="#" className="auth-link" onClick={switchModeHandler}>
                  Sign in
                </a>
              </span>
            )}
          </div>
        </Card>
      </div>
      <div className="auth-image-section">
        <img
          src={require('../../assets/login.jpg')}
          alt="Login Visual"
          className="auth-image"
        />
      </div>
    </div>
  );
};

export default Auth;
