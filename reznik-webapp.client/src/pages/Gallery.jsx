import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import './Gallery.css';

export default function Gallery() {
    const { t } = useTranslation();

    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [index, setIndex] = useState(-1);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch('/api/Gallery');
                if (response.ok) {
                    const data = await response.json();

                    const formattedImages = data.map(item => ({
                        id: item.id,
                        src: item.imageUrl,
                        thumb: item.imageUrl,
                        title: item.description || t('gallery.defaultImageTitle', 'Naše chovatelská stanice'),
                    }));

                    setImages(formattedImages);
                } else {
                    setError(t('gallery.errorFetch', 'Nepodařilo se načíst galerii.'));
                }
            } catch (err) {
                setError(t('common.errorNetwork', 'Chyba sítě. Zkontrolujte připojení.'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchGallery();
    }, [t]);

    return (
        <div className="gallery-page">
            <h1>{t('gallery.title')}</h1>
            <p className="gallery-intro">{t('gallery.intro')}</p>

            {isLoading && <p className="loading-text">{t('common.loading', 'Načítám...')}</p>}
            {error && <p className="error-text">{error}</p>}

            {!isLoading && !error && (
                <div className="gallery-grid">
                    {images.length > 0 ? (
                        images.map((img, i) => (
                            <div key={img.id} className="gallery-item" onClick={() => setIndex(i)}>
                                <img src={img.thumb} alt={img.title} />
                                <div className="gallery-item-overlay">
                                    <span>{img.title}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>{t('gallery.empty', 'Galerie je zatím prázdná.')}</p>
                    )}
                </div>
            )}

            <Lightbox
                index={index}
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={images}
                plugins={[Captions]}
            />
        </div>
    );
}