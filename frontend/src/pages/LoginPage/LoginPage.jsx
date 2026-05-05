import React, {useEffect, useState} from 'react';
import './LoginPage.scss';

import {authenticateUser} from "../../clients/BackendConnector.js";
import {useNavigate} from "react-router-dom";

import Card from "react-bootstrap/Card";
import {CardBody, CardHeader, CardTitle, Container} from "react-bootstrap";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authenticateUser(email, password)
            sessionStorage.setItem("customerId", response.customerId)
            navigate("/dashboard")
        } catch {
            setError(true)
        }

    };

    return (
        <Container className="login-page">
            <Card className="login-card">
                <CardHeader className="login-card-header">
                    <span>Ford Energy Rewards</span>
                </CardHeader>
                <CardTitle className="login-card-title">
                    <span>Sign In</span>
                </CardTitle>
                <CardBody>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form margin-bottom">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={error ? 'input-error' : ''}
                            />
                        </div>

                        <div className="form">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={error ? 'input-error' : ''}
                            />
                        </div>

                        {error && (
                            <div className="error-message">Wrong username or password. Please try again</div>
                        )}

                        <button type="submit" className="submit-button">
                            Sign In
                        </button>
                    </form>
                </CardBody>
            </Card>
        </Container>
    );
};

export default LoginPage;
