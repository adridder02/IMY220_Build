import React from 'react';
import { Link } from 'react-router-dom';
import "./css/forms.css"

const LoginPage = () => {
    return (
        <>
            <div className="form" id="logreg-container">
                <h1>Login</h1>
                <form action="/home">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" />
                    </div>
                    <Link to="/under_construction.html">Forgot password?</Link>
                    <div className="button-container">
                        <button type="submit">Sign In</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;