import React from 'react';
import { Link } from 'react-router-dom';
import "./css/forms.css"

const RegisterPage = () => {
    return (
        <>
            <div className="form" id="logreg-container">
                <h1>Register</h1>
                <form action="/home">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" />
                    </div>
                    <div>
                        <label htmlFor="confpassword">Confirm Password</label>
                        <input type="password" id="confpassword" />
                    </div>
                    <Link to="/login">Already have an account?</Link>
                    <div className="button-container">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default RegisterPage;