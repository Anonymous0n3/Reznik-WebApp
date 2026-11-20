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

    // ZMĚNA: Stavy pro více souborů a existujících obrázků
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

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
        setImageFiles([]);
        setExistingImages([]);
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
        // Načteme existující fotky z databáze
        setExistingImages(dog.images || []);
        setImageFiles([]);
        setMessage('');
        setError('');
    };

    // Funkce pro smazání existující fotky z náhledu před uložením
    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('Nahrávám data...');

        let newlyUploadedImages = [];

        // 1. Nahrání všech nových fotek na server postupně (pokud nějaké jsou)
        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', imageFiles[i]);

                try {
                    const uploadResponse = await fetch('/api/Upload', {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    });

                    if (uploadResponse.ok) {
                        const data = await uploadResponse.json();
                        // Ukládáme v požadovaném formátu pro naši databázi
                        newlyUploadedImages.push({ url: data.imageUrl });
                    } else {
                        setError(`Chyba při nahrávání fotky č. ${i + 1}.`);
                        return; // Přerušíme uložení, pokud se některá fotka nenahraje
                    }
                } catch (err) {
                    setError('Síťová chyba při nahrávání fotek.');
                    return;
                }
            }
        }

        const isEditing = editingDogId !== null;
        const url = isEditing ? `/api/OurDogs/${editingDogId}` : '/api/OurDogs';
        const method = isEditing ? 'PUT' : 'POST';

        // 2. Spojení ponechaných starých fotek a nově nahraných fotek
        // (EF Core v našem backendu maže staré a ukládá všechny poslané)
        const finalImagesList = [
            ...existingImages.map(img => ({ url: img.url })), // Původní ponechané fotky
            ...newlyUploadedImages // Nové fotky
        ];

        const dogData = {
            id: isEditing ? editingDogId : 0,
            name,
            gender,
            description,
            isReserved,
            images: finalImagesList // Posíláme pole fotek
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
                        <label>Fotografie:</label>
                        {/* ZMĚNA: Přidán atribut 'multiple' a upraven onChange */}
                        <input
                            id="dog-image-input"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => setImageFiles(Array.from(e.target.files))}
                        />

                        {/* Zobrazení vybraných NOVÝCH souborů (názvy) */}
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

                        {/* Zobrazení a správa EXISTUJÍCÍCH fotek z DB */}
                        {existingImages.length > 0 && (
                            <div style={{ marginTop: '15px' }}>
                                <small>Aktuální uložené fotky (kliknutím na X fotku smažete):</small>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                                    {existingImages.map((img, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img src={img.url} alt={`Uložená ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(index)}
                                                style={{
                                                    position: 'absolute', top: '-5px', right: '-5px',
                                                    background: 'red', color: 'white', border: 'none',
                                                    borderRadius: '50%', width: '24px', height: '24px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                    {dogs.map(dog => {
                        // ZMĚNA: Bereme první fotku z pole pro náhled
                        const hasImages = dog.images && dog.images.length > 0;
                        const mainImageUrl = hasImages ? dog.images[0].url : null;

                        return (
                            <div key={dog.id} className={`dog-card ${editingDogId === dog.id ? 'editing' : ''}`}>
                                {mainImageUrl ? (
                                    <div style={{ position: 'relative' }}>
                                        <img src={mainImageUrl} alt={dog.name} className="dog-card-img" />
                                        {dog.images.length > 1 && (
                                            <span style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>
                                                +{dog.images.length - 1} fotek
                                            </span>
                                        )}
                                    </div>
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
}