import React, { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../Session';

const LoginPage = () => {
    const { user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // if already logged in
    if (user) {
        return <Navigate to="/home" />;
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            console.log('Login response:', data.user); // debug
            setUser({ email: data.user.email, name: data.user.name });
            navigate('/home');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="form" id="logreg-container">
                <h1>Login</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
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