import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check', {
                    credentials: 'include'
                });

                if (response.ok) {
                    navigate('/admin');
                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Neplatné přihlašovací údaje.');
            }

            navigate('/admin');
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Ověřuji přihlášení...</div>;
    }

    return (
        <div className="login-container">
            <h2>Přihlášení administrátora</h2>
            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleLogin} className="login-form">
                <div className="login-field">
                    <label>E-mail:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="login-field">
                    <label>Heslo:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Přihlásit se
                </button>
            </form>
        </div>
    );
}