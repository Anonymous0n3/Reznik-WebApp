import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDogs.css';

export default function AdminLitters() {
    const [litters, setLitters] = useState([]);
    const [dogs, setDogs] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editingLitterId, setEditingLitterId] = useState(null);

    const [status, setStatus] = useState('planned');
    const [expectedDate, setExpectedDate] = useState('');
    const [expectedCount, setExpectedCount] = useState('');
    const [damId, setDamId] = useState('');
    const [sireId, setSireId] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchLitters();
        fetchDogs();
    }, []);

    const fetchLitters = async () => {
        try {
            const response = await fetch('/api/Litters');
            if (response.ok) setLitters(await response.json());
        } catch (err) {
            setError('Nepodařilo se načíst vrhy.');
        }
    };

    const fetchDogs = async () => {
        try {
            const response = await fetch('/api/OurDogs');
            if (response.ok) setDogs(await response.json());
        } catch (err) {
            setError('Nepodařilo se načíst psy pro výběr rodičů.');
        }
    };

    const resetForm = () => {
        setStatus('planned');
        setExpectedDate('');
        setExpectedCount('');
        setDamId('');
        setSireId('');
        setDescription('');
        setEditingLitterId(null);
    };

    const handleStartEdit = (litter) => {
        setEditingLitterId(litter.id);
        setStatus(litter.status || 'planned');
        setExpectedDate(litter.expectedDate || '');
        setExpectedCount(litter.expectedCount || '');
        setDamId(litter.damId);
        setSireId(litter.sireId);
        setDescription(litter.description || '');
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const isEditing = editingLitterId !== null;
        const url = isEditing ? `/api/Litters/${editingLitterId}` : '/api/Litters';
        const method = isEditing ? 'PUT' : 'POST';

        const litterData = {
            id: isEditing ? editingLitterId : 0,
            status,
            expectedDate,
            expectedCount,
            damId: parseInt(damId),
            sireId: parseInt(sireId),
            description
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(litterData),
            });

            if (response.ok) {
                setMessage(isEditing ? `Vrh byl úspěšně upraven.` : `Nový vrh byl přidán!`);
                resetForm();
                fetchLitters();
            } else {
                setError('Ukládání selhalo. Zkontroluj přihlášení.');
            }
        } catch (err) {
            setError('Chyba sítě.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Opravdu smazat tento vrh?`)) return;

        try {
            const response = await fetch(`/api/Litters/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) {
                setMessage(`Vrh byl smazán.`);
                if (editingLitterId === id) resetForm();
                fetchLitters();
            } else {
                setError('Nemáš oprávnění k mazání.');
            }
        } catch (err) {
            setError('Chyba sítě při mazání.');
        }
    };

    const females = dogs.filter(d => d.gender === 'female');
    const males = dogs.filter(d => d.gender === 'male');

    const getDogName = (id) => dogs.find(d => d.id === id)?.name || "Neznámý";

    return (
        <div className="admin-dashboard">
            <div className="admin-form-section">
                <Link to="/admin" className="back-link">← Zpět na rozcestník</Link>
                <h2>{editingLitterId ? 'Upravit vrh' : 'Přidat nový vrh'}</h2>
                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                <form onSubmit={handleSubmit} className="dog-form">
                    <div className="form-group">
                        <label>Stav vrhu:</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} required>
                            <option value="planned">Plánovaný (Planned)</option>
                            <option value="current">Aktuální (Current)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Matka (Dam):</label>
                        <select value={damId} onChange={e => setDamId(e.target.value)} required>
                            <option value="">-- Vyber fenku --</option>
                            {females.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Otec (Sire):</label>
                        <select value={sireId} onChange={e => setSireId(e.target.value)} required>
                            <option value="">-- Vyber krycího psa --</option>
                            {males.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Očekávané datum (textově):</label>
                        <input type="text" placeholder="např. Jaro 2024 nebo 15.5.2024" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Očekávaný počet / Info ke štěňatům:</label>
                        <input type="text" placeholder="např. 5 štěňat, zadaná" value={expectedCount} onChange={e => setExpectedCount(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Popis:</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4"></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {editingLitterId ? 'Uložit změny' : 'Vytvořit vrh'}
                        </button>
                        {editingLitterId && (
                            <button type="button" onClick={resetForm} className="cancel-btn">Zrušit</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="admin-list-section">
                <h2>Seznam vrhů ({litters.length})</h2>
                <div className="dogs-grid">
                    {litters.map(litter => (
                        <div key={litter.id} className={`dog-card ${editingLitterId === litter.id ? 'editing' : ''}`}>
                            <h3>Vrh: {getDogName(litter.damId)} x {getDogName(litter.sireId)}</h3>
                            <span className={`badge ${litter.status === 'current' ? 'male' : 'reserved'}`}>
                                {litter.status === 'current' ? 'Aktuální' : 'Plánovaný'}
                            </span>
                            <p><strong>Datum:</strong> {litter.expectedDate}</p>
                            <p><strong>Počet/Info:</strong> {litter.expectedCount}</p>
                            <p>{litter.description}</p>

                            <div className="card-actions">
                                <button onClick={() => handleStartEdit(litter)} className="edit-btn">Upravit</button>
                                <button onClick={() => handleDelete(litter.id)} className="delete-btn">Smazat</button>
                            </div>
                        </div>
                    ))}
                    {litters.length === 0 && <p>Zatím tu nejsou žádné vrhy.</p>}
                </div>
            </div>
        </div>
    );
}