import React from 'react';
import { Link } from 'react-router-dom';


function SignUp() {
    return (
        <div className='container right-panel-active'>
            <div className='form-container sign-up-container'>
                <form action="#">
                    <h1>Create Account</h1>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Sign Up</button>
                </form>
            </div>
                 <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button className="link-button">
                    <Link to='/'>Sign In</Link>
                </button>
           
            </div> 
         
                    
        </div>
    );
}

export default SignUp;

