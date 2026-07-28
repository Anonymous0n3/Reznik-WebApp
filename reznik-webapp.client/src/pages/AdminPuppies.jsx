import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminLitters.css';

export default function AdminPuppies() {
    const [litters, setLitters] = useState([]);
    const [puppies, setPuppies] = useState([]);
    const [selectedLitterId, setSelectedLitterId] = useState('');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editingPuppyId, setEditingPuppyId] = useState(null);

    const [name, setName] = useState('');
    const [gender, setGender] = useState('male');
    const [status, setStatus] = useState('available');
    const [colorInfo, setColorInfo] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    useEffect(() => {
        fetchLitters();
    }, []);

    useEffect(() => {
        if (selectedLitterId) fetchPuppies(selectedLitterId);
        else setPuppies([]);
        resetForm();
    }, [selectedLitterId]);

    const fetchLitters = async () => {
        const response = await fetch('/api/Litters');
        if (response.ok) setLitters(await response.json());
    };

    const fetchPuppies = async (litterId) => {
        const response = await fetch(`/api/Puppies/bylitter/${litterId}`);
        if (response.ok) setPuppies(await response.json());
    };

    const resetForm = () => {
        setName('');
        setGender('male');
        setStatus('available');
        setColorInfo('');
        setImageFile(null);
        setCurrentImageUrl('');
        setEditingPuppyId(null);
        const fileInput = document.getElementById('puppy-image-input');
        if (fileInput) fileInput.value = '';
    };

    const handleStartEdit = (puppy) => {
        setEditingPuppyId(puppy.id);
        setName(puppy.name);
        setGender(puppy.gender);
        setStatus(puppy.status);
        setColorInfo(puppy.colorInfo || '');
        setCurrentImageUrl(puppy.imageUrl || '');
        setImageFile(null);
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLitterId) return setError('Vyberte vrh.');
        setError('');
        setMessage('Ukládám...');

        let finalImageUrl = currentImageUrl;

        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            try {
                const uploadRes = await fetch('/api/Upload', { method: 'POST', credentials: 'include', body: formData });
                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalImageUrl = data.imageUrl;
                } else throw new Error('Chyba fotky');
            } catch (err) {
                return setError('Nepodařilo se nahrát fotku.');
            }
        }

        const isEditing = editingPuppyId !== null;
        const url = isEditing ? `/api/Puppies/${editingPuppyId}` : '/api/Puppies';

        const puppyData = {
            id: isEditing ? editingPuppyId : 0,
            name, gender, status, colorInfo,
            imageUrl: finalImageUrl,
            litterId: parseInt(selectedLitterId)
        };

        try {
            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(puppyData),
            });

            if (response.ok) {
                setMessage(isEditing ? 'Štěně upraveno.' : 'Štěně přidáno!');
                resetForm();
                fetchPuppies(selectedLitterId);
            } else setError('Ukládání selhalo.');
        } catch (err) {
            setError('Chyba sítě.');
        }
    };

    const handleDelete = async (id, puppyName) => {
        if (!window.confirm(`Smazat štěně ${puppyName}?`)) return;
        const response = await fetch(`/api/Puppies/${id}`, { method: 'DELETE', credentials: 'include' });
        if (response.ok) {
            setMessage('Smazáno.');
            fetchPuppies(selectedLitterId);
        }
    };

    const translateStatus = (s) => {
        if (s === 'available') return 'Volné';
        if (s === 'reserved') return 'Zadané';
        return s;
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-form-section">
                <Link to="/admin" className="back-link">← Zpět na rozcestník</Link>
                <h2>Správa štěňátek</h2>

                <div className="form-group" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid #eee' }}>
                    <label>Vyberte vrh pro správu štěňat:</label>
                    <select value={selectedLitterId} onChange={e => setSelectedLitterId(e.target.value)}>
                        <option value="">-- Zvolte vrh --</option>
                        {litters.map(l => (
                            <option key={l.id} value={l.id}>
                                Vrh: {l.expectedDate || 'Neznámé datum'} ({l.status === 'current' ? 'Aktuální' : 'Plánovaný'})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedLitterId && (
                    <form onSubmit={handleSubmit} className="dog-form">
                        <h3>{editingPuppyId ? 'Upravit štěně' : 'Přidat štěně do vrhu'}</h3>
                        {message && <div className={`alert ${error ? 'error' : 'success'}`}>{error || message}</div>}

                        <div className="form-group">
                            <label>Jméno (např. Apollo):</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Zbarvení / Rozlišovák (např. Modrý obojek):</label>
                            <input type="text" value={colorInfo} onChange={e => setColorInfo(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>Pohlaví:</label>
                            <select value={gender} onChange={e => setGender(e.target.value)}>
                                <option value="male">Pes</option>
                                <option value="female">Fena</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Stav:</label>
                            <select value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="available">Volné</option>
                                <option value="reserved">Zadané</option>
                                <option value="sold">V novém domově</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fotografie:</label>
                            <input id="puppy-image-input" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                            {currentImageUrl && !imageFile && (
                                <img src={currentImageUrl} alt="Aktuální" style={{ width: '80px', marginTop: '10px', borderRadius: '5px' }} />
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">{editingPuppyId ? 'Uložit' : 'Přidat'}</button>
                            {editingPuppyId && <button type="button" onClick={resetForm} className="cancel-btn">Zrušit</button>}
                        </div>
                    </form>
                )}
            </div>

            {selectedLitterId && (
                <div className="admin-list-section">
                    <h2>Štěňata ve vrhu ({puppies.length})</h2>
                    <div className="dogs-grid">
                        {puppies.map(puppy => (
                            <div key={puppy.id} className="dog-card">
                                {puppy.imageUrl ? (
                                    <img src={puppy.imageUrl} alt={puppy.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '150px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>Bez fotky</div>
                                )}

                                <h3 style={{ marginTop: '10px' }}>{puppy.name}</h3>
                                <p><strong>{translateStatus(puppy.status)}</strong></p>
                                <p>{puppy.gender === 'male' ? 'Pes' : 'Fena'} | {puppy.colorInfo}</p>

                                <div className="card-actions">
                                    <button onClick={() => handleStartEdit(puppy)} className="edit-btn">Upravit</button>
                                    <button onClick={() => handleDelete(puppy.id, puppy.name)} className="delete-btn">Smazat</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}