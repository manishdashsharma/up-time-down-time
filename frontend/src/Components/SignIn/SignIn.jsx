import React from 'react';
import { Link } from 'react-router-dom';

function SignIn() {
    return (
        <div className='container'>
            <div className='form-container sign-in-container'>
                <form action="#">
                    <h1>Sign In</h1>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <a href="#">Forgot your password?</a>
                    <button>Sign In</button>
                </form>
            </div>
            { <div className="overlay-panel overlay-right">
                <h1>Hello, Explorer!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="link-button">
                <Link to='/signUp'>Sign Up</Link>
                </button>
            </div> }
         
        </div>
    );
}

export default SignIn;

