import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminLitters.css';

export default function AdminReservations() {
    const [litters, setLitters] = useState([]);
    const [reservations, setReservations] = useState([]);

    const [selectedLitterId, setSelectedLitterId] = useState('');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editingResId, setEditingResId] = useState(null);

    const [name, setName] = useState('');
    const [preferredGender, setPreferredGender] = useState('any');

    useEffect(() => {
        fetchLitters();
    }, []);

    useEffect(() => {
        if (selectedLitterId) {
            fetchReservationsForLitter(selectedLitterId);
        } else {
            setReservations([]);
        }
        resetForm();
    }, [selectedLitterId]);

    const fetchLitters = async () => {
        try {
            const response = await fetch('/api/Litters');
            if (response.ok) setLitters(await response.json());
        } catch (err) {
            setError('Nepodařilo se načíst seznam vrhů.');
        }
    };

    const fetchReservationsForLitter = async (litterId) => {
        try {
            const response = await fetch(`/api/Reservations/bylitter/${litterId}`, {
                credentials: 'include'
            });
            if (response.ok) setReservations(await response.json());
        } catch (err) {
            setError('Nepodařilo se načíst rezervace.');
        }
    };

    const resetForm = () => {
        setName('');
        setPreferredGender('any');
        setEditingResId(null);
    };

    const handleStartEdit = (res) => {
        setEditingResId(res.id);
        setName(res.name);
        setPreferredGender(res.preferredGender);
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLitterId) {
            setError('Nejprve vyberte vrh, ke kterému chcete rezervaci přidat.');
            return;
        }

        setError('');
        setMessage('');

        const isEditing = editingResId !== null;
        const url = isEditing ? `/api/Reservations/${editingResId}` : '/api/Reservations';
        const method = isEditing ? 'PUT' : 'POST';

        const reservationData = {
            id: isEditing ? editingResId : 0,
            name,
            preferredGender,
            litterId: parseInt(selectedLitterId)
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                setMessage(isEditing ? `Rezervace upravena.` : `Zájemce ${name} přidán!`);
                resetForm();
                fetchReservationsForLitter(selectedLitterId);
            } else {
                setError('Ukládání selhalo.');
            }
        } catch (err) {
            setError('Chyba sítě.');
        }
    };

    const handleDelete = async (id, resName) => {
        if (!window.confirm(`Opravdu smazat rezervaci pro: ${resName}?`)) return;

        try {
            const response = await fetch(`/api/Reservations/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                setMessage(`Rezervace smazána.`);
                if (editingResId === id) resetForm();
                fetchReservationsForLitter(selectedLitterId);
            } else {
                setError('Chyba při mazání.');
            }
        } catch (err) {
            setError('Chyba sítě při mazání.');
        }
    };

    const translateGender = (gender) => {
        if (gender === 'male') return 'Pes';
        if (gender === 'female') return 'Fena';
        return 'Nezáleží';
    };

    return (
        <div className="admin-dashboard" style={{ display: 'block', maxWidth: '800px' }}>
            <Link to="/admin" className="back-link">← Zpět na rozcestník</Link>
            <h2>Správa rezervací</h2>

            <div className="admin-form-section" style={{ marginBottom: '30px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                    Vyberte vrh pro správu rezervací:
                </label>
                <select
                    value={selectedLitterId}
                    onChange={(e) => setSelectedLitterId(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="">-- Zvolte vrh --</option>
                    {litters.map(l => (
                        <option key={l.id} value={l.id}>
                            Vrh: {l.expectedDate || 'Neznámé datum'} ({l.status === 'current' ? 'Aktuální' : 'Plánovaný'})
                        </option>
                    ))}
                </select>
            </div>

            {selectedLitterId && (
                <>
                    <div className="admin-form-section" style={{ marginBottom: '30px' }}>
                        <h3>{editingResId ? 'Upravit rezervaci' : 'Přidat zájemce'}</h3>
                        {message && <div className="alert success">{message}</div>}
                        {error && <div className="alert error">{error}</div>}

                        <form onSubmit={handleSubmit} className="dog-form">
                            <div className="form-group">
                                <label>Jméno zájemce:</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label>Preferované pohlaví štěněte:</label>
                                <select value={preferredGender} onChange={e => setPreferredGender(e.target.value)}>
                                    <option value="any">Nezáleží</option>
                                    <option value="female">Fena</option>
                                    <option value="male">Pes</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    {editingResId ? 'Uložit změny' : 'Přidat zájemce'}
                                </button>
                                {editingResId && (
                                    <button type="button" onClick={resetForm} className="cancel-btn">Zrušit</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="admin-list-section">
                        <h3>Pořadník k vybranému vrhu ({reservations.length})</h3>
                        <div className="dogs-grid">
                            {reservations.map((res, index) => (
                                <div key={res.id} className={`dog-card ${editingResId === res.id ? 'editing' : ''}`}>
                                    <h4>{index + 1}. {res.name}</h4>
                                    <p><strong>Preference:</strong> {translateGender(res.preferredGender)}</p>

                                    <div className="card-actions">
                                        <button onClick={() => handleStartEdit(res)} className="edit-btn">Upravit</button>
                                        <button onClick={() => handleDelete(res.id, res.name)} className="delete-btn">Smazat</button>
                                    </div>
                                </div>
                            ))}
                            {reservations.length === 0 && <p>Zatím žádní zájemci.</p>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}