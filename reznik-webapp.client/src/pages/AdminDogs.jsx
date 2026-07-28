import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDogs.css';

export default function AdminDogs() {
    const [dogs, setDogs] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editingDogId, setEditingDogId] = useState(null);

    const [name, setName] = useState('');
    const [gender, setGender] = useState('female');
    const [description, setDescription] = useState('');
    const [isReserved, setIsReserved] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    useEffect(() => {
        fetchDogs();
    }, []);

    const fetchDogs = async () => {
        try {
            const response = await fetch('/api/OurDogs');
            if (response.ok) {
                setDogs(await response.json());
            }
        } catch (err) {
            setError('Chyba komunikace se serverem.');
        }
    };

    const resetForm = () => {
        setName('');
        setGender('female');
        setDescription('');
        setIsReserved(false);
        setImageFile(null);
        setCurrentImageUrl('');
        setEditingDogId(null);

        const fileInput = document.getElementById('dog-image-input');
        if (fileInput) fileInput.value = '';
    };

    const handleStartEdit = (dog) => {
        setEditingDogId(dog.id);
        setName(dog.name);
        setGender(dog.gender);
        setDescription(dog.description || '');
        setIsReserved(dog.isReserved);
        setCurrentImageUrl(dog.imageUrl || '');
        setImageFile(null);
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('Nahrávám data...');

        let finalImageUrl = currentImageUrl;

        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);

            try {
                const uploadResponse = await fetch('/api/Upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                if (uploadResponse.ok) {
                    const data = await uploadResponse.json();
                    finalImageUrl = data.imageUrl;
                } else {
                    setError('Chyba při nahrávání fotky.');
                    return;
                }
            } catch (err) {
                setError('Síťová chyba při nahrávání fotky.');
                return;
            }
        }

        const isEditing = editingDogId !== null;
        const url = isEditing ? `/api/OurDogs/${editingDogId}` : '/api/OurDogs';
        const method = isEditing ? 'PUT' : 'POST';

        const dogData = {
            id: isEditing ? editingDogId : 0,
            name,
            gender,
            description,
            isReserved,
            imageUrl: finalImageUrl
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dogData),
            });

            if (response.ok) {
                setMessage(isEditing ? `Pes ${name} byl upraven.` : `Pes ${name} byl úspěšně přidán!`);
                resetForm();
                fetchDogs();
            } else {
                setError('Něco se pokazilo při ukládání psa.');
            }
        } catch (err) {
            setError('Chyba sítě při odesílání dat psa.');
        }
    };

    const handleDelete = async (id, dogName) => {
        if (!window.confirm(`Opravdu chceš smazat psa "${dogName}"?`)) return;
        try {
            const response = await fetch(`/api/OurDogs/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                if (editingDogId === id) resetForm();
                fetchDogs();
            }
        } catch (err) {
            setError('Chyba mazání.');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-form-section">
                <Link to="/admin" className="back-link">← Zpět na rozcestník</Link>
                <h2>{editingDogId ? 'Upravit psa' : 'Přidat nového psa'}</h2>
                {message && <div className={`alert ${error ? 'error' : 'success'}`}>{error || message}</div>}

                <form onSubmit={handleSubmit} className="dog-form">
                    <div className="form-group">
                        <label>Jméno psa:</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Fotografie (nepovinné):</label>
                        <input
                            id="dog-image-input"
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0])}
                        />
                        {currentImageUrl && !imageFile && (
                            <div style={{ marginTop: '10px' }}>
                                <small>Aktuální fotka:</small><br />
                                <img src={currentImageUrl} alt="Aktuální" style={{ width: '100px', borderRadius: '5px' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Pohlaví:</label>
                        <select value={gender} onChange={e => setGender(e.target.value)}>
                            <option value="female">Fena</option>
                            <option value="male">Pes</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Popis:</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4"></textarea>
                    </div>

                    <div className="form-group checkbox">
                        <label>
                            <input type="checkbox" checked={isReserved} onChange={e => setIsReserved(e.target.checked)} />
                            Zarezervován
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {editingDogId ? 'Uložit změny' : 'Uložit do databáze'}
                        </button>
                        {editingDogId && (
                            <button type="button" onClick={resetForm} className="cancel-btn">
                                Zrušit úpravu
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="admin-list-section">
                <h2>Naše smečka ({dogs.length})</h2>
                <div className="dogs-grid">
                    {dogs.map(dog => (
                        <div key={dog.id} className={`dog-card ${editingDogId === dog.id ? 'editing' : ''}`}>
                            {dog.imageUrl ? (
                                <img src={dog.imageUrl} alt={dog.name} className="dog-card-img" />
                            ) : (
                                <div className="dog-card-placeholder">Bez fotky</div>
                            )}

                            <h3>{dog.name}</h3>
                            <span className={`badge ${dog.gender}`}>{dog.gender === 'male' ? 'Pes' : 'Fena'}</span>
                            {dog.isReserved && <span className="badge reserved">Zadáno</span>}
                            <p>{dog.description}</p>

                            <div className="card-actions">
                                <button onClick={() => handleStartEdit(dog)} className="edit-btn">Upravit</button>
                                <button onClick={() => handleDelete(dog.id, dog.name)} className="delete-btn">Smazat</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}