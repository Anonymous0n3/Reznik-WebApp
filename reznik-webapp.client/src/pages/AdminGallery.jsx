import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminGallery.css';

export default function AdminGallery() {
    const [images, setImages] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState('');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await fetch('/api/Gallery');
            if (response.ok) {
                setImages(await response.json());
            }
        } catch (err) {
            setError('Nepodařilo se načíst galerii.');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setError('Vyberte prosím obrázek.');
            return;
        }

        setError('');
        setMessage('');
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', imageFile);

            const uploadResponse = await fetch('/api/Upload', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!uploadResponse.ok) throw new Error('Nahrávání souboru selhalo.');
            const uploadData = await uploadResponse.json();

            const galleryData = {
                imageUrl: uploadData.imageUrl,
                description: description
            };

            const dbResponse = await fetch('/api/Gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(galleryData)
            });

            if (dbResponse.ok) {
                setMessage('Obrázek byl úspěšně přidán do galerie.');
                setDescription('');
                setImageFile(null);

                const fileInput = document.getElementById('gallery-upload-input');
                if (fileInput) fileInput.value = '';

                fetchGallery();
            } else {
                throw new Error('Ukládání do databáze selhalo.');
            }
        } catch (err) {
            setError(err.message || 'Chyba sítě.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Opravdu chcete tento obrázek smazat? Bude trvale odstraněn i ze serveru.')) return;

        try {
            const response = await fetch(`/api/Gallery/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setMessage('Obrázek byl smazán.');
                fetchGallery();
            } else {
                setError('Nepodařilo se smazat obrázek.');
            }
        } catch (err) {
            setError('Chyba komunikace se serverem.');
        }
    };

    return (
        <div className="admin-dashboard admin-gallery-page">
            <div className="admin-form-section" style={{ marginBottom: '30px', maxWidth: '600px' }}>
                <Link to="/admin" className="back-link">← Zpět na rozcestník</Link>
                <h2>Přidat fotku do galerie</h2>

                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                <form onSubmit={handleUpload} className="dog-form">
                    <div className="form-group">
                        <label>Vybrat fotografii:</label>
                        <input
                            id="gallery-upload-input"
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Popisek (volitelné):</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Např. Štěňátka z Vrhu A hrající si na zahradě"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={isUploading}>
                        {isUploading ? 'Nahrávám...' : 'Nahrát do galerie'}
                    </button>
                </form>
            </div>

            <div className="gallery-grid">
                {images.map(img => (
                    <div key={img.id} className="gallery-item">
                        <div className="gallery-img-wrapper">
                            <img src={img.imageUrl} alt={img.description || 'Fotka galerie'} />
                            <button onClick={() => handleDelete(img.id)} className="delete-overlay-btn">
                                🗑 Smazat
                            </button>
                        </div>
                        {img.description && <p className="gallery-desc">{img.description}</p>}
                    </div>
                ))}
                {images.length === 0 && <p>Galerie je zatím prázdná.</p>}
            </div>
        </div>
    );
}