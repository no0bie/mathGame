import React, { useState } from 'react';
import PropTypes from 'prop-types';

import "./style.css"


export default function Login({ setToken }) {

  let [errText, setErrText] = useState("");

  const loginHandler = async (creds) => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    };
    return fetch(process.env.REACT_APP_GET_USER, requestOptions)
        .then(response => response.json());
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
  
    const username = e.target.elements[0].value;
    const password = e.target.elements[1].value;
  
    const token = await loginHandler({usern: username, passwd: password});
    setToken(token);
    setErrText("Wrong username or password");
  }

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={submitHandler}>
        <label>
          <h2 style={{color: "red"}}>{errText}</h2>
        </label>
        <label>
          <h3>Username</h3>
          <input className='test' type="text" />
        </label>
        <label>
          <h3>Password</h3>
          <input type="password" />
        </label>
        <div>
          <button className="button-30" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );

  Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }
}