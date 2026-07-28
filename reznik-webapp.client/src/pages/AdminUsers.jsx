import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminLitters.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/auth/users', { credentials: 'include' });
            if (response.ok) setUsers(await response.json());
        } catch (err) {
            setError('Chyba při načítání uživatelů.');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/auth/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                setMessage(`Uživatel ${email} byl úspěšně přidán.`);
                setEmail('');
                setPassword('');
                fetchUsers();
            } else {
                const errText = await response.text();
                setError(errText || 'Chyba při ukládání.');
            }
        } catch (err) {
            setError('Chyba sítě.');
        }
    };

    const handleDeleteUser = async (id, userEmail) => {
        if (!window.confirm(`Opravdu chcete odebrat přístup uživateli ${userEmail}?`)) return;

        try {
            const response = await fetch(`/api/auth/users/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setMessage(`Uživatel ${userEmail} smazán.`);
                fetchUsers();
            } else {
                const errText = await response.text();
                setError(errText || 'Chyba při mazání.');
            }
        } catch (err) {
            setError('Chyba sítě.');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-form-section">
                <Link to="/admin" className="back-link">← Zpět na rozcestník</Link>
                <h2>Přidat administrátora</h2>
                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                <form onSubmit={handleAddUser} className="dog-form">
                    <div className="form-group">
                        <label>Přihlašovací E-mail:</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Nové heslo:</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />
                    </div>

                    <button type="submit" className="submit-btn">Vytvořit účet</button>
                </form>
            </div>

            <div className="admin-list-section">
                <h2>Seznam administrátorů ({users.length})</h2>
                <div className="dogs-grid">
                    {users.map(user => (
                        <div key={user.id} className="dog-card">
                            <h3>👤 {user.email}</h3>
                            <div className="card-actions">
                                <button onClick={() => handleDeleteUser(user.id, user.email)} className="delete-btn">
                                    Odebrat přístup
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}