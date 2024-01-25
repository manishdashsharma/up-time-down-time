import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css"

function Authentication() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    username: '',
  })
  useEffect(() => {
    if (isSignIn) {
      setFormData((previousData) => ({
        ...previousData,
        password: '',
      }));
    }
  
  }, [isSignIn]);
  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      username: '',
    });
  };
  const toggleForm = () => {
    setIsSignIn(prevState => !prevState);
    resetFormData();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) =>
    ({
      ...data,
      [name]: value
    })
    )
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const commonData = {
      username: form.username,
      password: form.password,
    };
    const signUpData = !isSignIn ? { ...commonData, name: form.name, email: form.email, phoneNumber: form.phoneNumber } : null;
    const loginData = isSignIn ? commonData : null;

    if (signUpData) {
      await axios.post('https://up-time-down-time.vercel.app/api/v1/auth/signup', signUpData)
        .then((response) => {
          toast.success(response.data.message, { position: toast.POSITION.TOP_RIGHT })
          setIsSignIn(true);
        }).catch((error) => {
          toast.error(error.response.data.message, { position: toast.POSITION.TOP_RIGHT })
        })
    }
    if (loginData) {
      await axios.post('https://up-time-down-time.vercel.app/api/v1/auth/login', loginData)
        .then((response) => {
          toast.success(response.data.message, { position: toast.POSITION.TOP_RIGHT })
        }).catch((error) => {
          toast.error(error.response.data.message, { position: toast.POSITION.TOP_RIGHT })
        })
    }
  };

  return (
    <div className={`container ${isSignIn ? '' : 'right-panel-active'}`}>
      <div className={`form-container ${isSignIn ? 'sign-in-container' : 'sign-up-container'}`}>
        <form action="#" onSubmit={handleSubmit}>
          <h1>{isSignIn ? 'Sign In' : 'Create Account'}</h1>
          {!isSignIn && <input type="text" name="name" placeholder="Name"  value={form.name} onChange={handleChange} />}
          {!isSignIn && <input type="email" name="email" placeholder="Email"value={form.email} onChange={handleChange} />}
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} autoComplete="new-password" />
          {!isSignIn && <input type="tel" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} />}
          <button type='submit'>{isSignIn ? 'Sign In' : 'Sign Up'}</button>
        </form>
      </div>
      <div className={`overlay-panel ${isSignIn ? 'overlay-right' : 'overlay-left'}`}>
        <h1>{isSignIn ? 'Hello, Explorer!' : 'Welcome Back!'}</h1>
        <p>{isSignIn ? 'Enter your personal details and start journey with us' : 'To keep connected with us please login with your personal info'}</p>
        <button className="link-button" onClick={toggleForm}>
          {isSignIn ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

export default Authentication;
