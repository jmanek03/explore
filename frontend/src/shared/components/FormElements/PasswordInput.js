import React, { useReducer, useEffect, useState } from 'react';
import { validate } from '../../util/validators';
import './PasswordInput.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      };
    }
    default:
      return state;
  }
};

const PasswordInput = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const [showPassword, setShowPassword] = useState(false);

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  return (
    <div
      className={`form-control password-form-control ${!inputState.isValid &&
        inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <div className="password-input-wrapper">
        <input
          id={props.id}
          type={showPassword ? 'text' : 'password'}
          placeholder={props.placeholder}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="show-hide-btn"
          tabIndex={-1}
          onClick={() => setShowPassword(val => !val)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path stroke="#64748b" strokeWidth="2" d="M3 3l18 18M10.7 10.7a3 3 0 104.6 4.6M6.53 6.53A9.77 9.77 0 003 12s3.6 6 9 6c1.61 0 3.09-.37 4.47-1.03M17.47 17.47A9.77 9.77 0 0021 12s-3.6-6-9-6c-1.61 0-3.09.37-4.47 1.03"/>
            </svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path stroke="#64748b" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
              <circle cx="12" cy="12" r="3" stroke="#64748b" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default PasswordInput;
        
