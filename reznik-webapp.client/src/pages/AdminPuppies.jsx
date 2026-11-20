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

    // ZMĚNA: Stavy pro více fotek
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

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
        setImageFiles([]);
        setExistingImages([]);
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
        // ZMĚNA: Načtení pole existujících fotek
        setExistingImages(puppy.images || []);
        setImageFiles([]);
        setMessage('');
        setError('');
    };

    // ZMĚNA: Smazání existující fotky z náhledu
    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLitterId) return setError('Vyberte vrh.');
        setError('');
        setMessage('Ukládám data...');

        let newlyUploadedImages = [];

        // ZMĚNA: Nahrání všech nových fotek
        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', imageFiles[i]);
                try {
                    const uploadRes = await fetch('/api/Upload', { method: 'POST', credentials: 'include', body: formData });
                    if (uploadRes.ok) {
                        const data = await uploadRes.json();
                        newlyUploadedImages.push({ url: data.imageUrl });
                    } else throw new Error('Chyba fotky');
                } catch (err) {
                    return setError(`Nepodařilo se nahrát fotku č. ${i + 1}.`);
                }
            }
        }

        const isEditing = editingPuppyId !== null;
        const url = isEditing ? `/api/Puppies/${editingPuppyId}` : '/api/Puppies';

        // ZMĚNA: Sloučení ponechaných starých a nových fotek
        const finalImagesList = [
            ...existingImages.map(img => ({ url: img.url })),
            ...newlyUploadedImages
        ];

        const puppyData = {
            id: isEditing ? editingPuppyId : 0,
            name,
            gender,
            status,
            colorInfo,
            images: finalImagesList, // ZMĚNA: Odeslání pole images
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
        if (s === 'sold') return 'V novém domově';
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
                            <label>Fotografie (můžete vybrat více):</label>
                            <input
                                id="puppy-image-input"
                                type="file"
                                accept="image/*"
                                multiple // ZMĚNA: Povolen výběr více souborů
                                onChange={e => setImageFiles(Array.from(e.target.files))}
                            />

                            {/* Zobrazení vybraných nových fotek */}
                            {imageFiles.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    <small>Nové fotky k nahrání:</small>
                                    <ul>
                                        {imageFiles.map((file, i) => (
                                            <li key={i}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Zobrazení existujících fotek */}
                            {existingImages.length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <small>Uložené fotky (kliknutím na křížek smažete):</small>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                                        {existingImages.map((img, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img src={img.url} alt={`Uložená ${index}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(index)}
                                                    style={{
                                                        position: 'absolute', top: '-5px', right: '-5px',
                                                        background: 'red', color: 'white', border: 'none',
                                                        borderRadius: '50%', width: '22px', height: '22px',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">{editingPuppyId ? 'Uložit změny' : 'Přidat štěně'}</button>
                            {editingPuppyId && <button type="button" onClick={resetForm} className="cancel-btn">Zrušit úpravu</button>}
                        </div>
                    </form>
                )}
            </div>

            {selectedLitterId && (
                <div className="admin-list-section">
                    <h2>Štěňata ve vrhu ({puppies.length})</h2>
                    <div className="dogs-grid">
                        {puppies.map(puppy => {
                            // ZMĚNA: Bezpečné získání prvního obrázku
                            const hasImages = puppy.images && puppy.images.length > 0;
                            const mainImg = hasImages ? puppy.images[0].url : null;

                            return (
                                <div key={puppy.id} className={`dog-card ${editingPuppyId === puppy.id ? 'editing' : ''}`}>
                                    {mainImg ? (
                                        <div style={{ position: 'relative' }}>
                                            <img src={mainImg} alt={puppy.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
                                            {puppy.images.length > 1 && (
                                                <span style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>
                                                    +{puppy.images.length - 1} fotek
                                                </span>
                                            )}
                                        </div>
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
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}