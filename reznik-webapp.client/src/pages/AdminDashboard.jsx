import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/login');
            }
        } catch (err) {
            console.error('Chyba při odhlašování:', err);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Administrace chovatelské stanice</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Odhlásit se
                </button>
            </header>

            <div className="dashboard-cards">
                <Link to="/admin/dogs" className="dashboard-card">
                    <div className="card-icon">🐕</div>
                    <h3>Správa psů</h3>
                    <p>Přidávání, úprava a mazání psů (fen i krycích psů) ve vaší smečce.</p>
                </Link>

                <Link to="/admin/litters" className="dashboard-card">
                    <div className="card-icon">🐾</div>
                    <h3>Správa vrhů</h3>
                    <p>Evidence aktuálních i plánovaných vrhů, přiřazování rodičů.</p>
                </Link>

                <Link to="/admin/reservations" className="dashboard-card">
                    <div className="card-icon">📝</div>
                    <h3>Rezervace</h3>
                    <p>Správa zájemců o štěňátka a pořadníky k vrhům.</p>
                </Link>

                <Link to="/admin/users" className="dashboard-card">
                    <div className="card-icon">👥</div>
                    <h3>Uživatelé</h3>
                    <p>Správa uživatelů systému a jejich oprávnění.</p>
                </Link>

                <Link to="/admin/gallery" className="dashboard-card">
                    <div className="card-icon">🖼️</div>
                    <h3>Galerie</h3>
                    <p>Správa fotografií v galerii.</p>
                </Link>

                <Link to="/admin/puppies" className="dashboard-card">
                    <div className="card-icon">🐕</div>
                    <h3>Štěňata</h3>
                    <p>Správa informací o štěňatech a jejich fotografiích.</p>
                </Link>
            </div>
        </div>
    );
}