import { useState } from 'react';
import { createPortal } from 'react-dom'; // PŘIDÁNO: import pro portal
import './DogCard.css';
import { useTranslation } from 'react-i18next';

export default function DogCard({ name, images, description, isReserved, gender }) {
    const { t } = useTranslation();

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const hasImages = images && images.length > 0;
    const mainImageUrl = hasImages ? images[0].url : '/placeholder-dog.jpg';

    const openLightbox = () => {
        if (hasImages) {
            setCurrentImgIndex(0);
            setIsLightboxOpen(true);
        }
    };

    const closeLightbox = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsLightboxOpen(false);
    };

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="dog-card">
            <div className="dog-card-image-wrapper" onClick={openLightbox} style={{ cursor: hasImages ? 'pointer' : 'default' }}>
                <img
                    src={mainImageUrl}
                    alt={`Fotografie psa jménem ${name}`}
                    className="dog-card-main-img"
                />

                {hasImages && images.length > 1 && (
                    <div className="photo-count-badge">
                        📸 1 / {images.length}
                    </div>
                )}
            </div>

            <div className="dog-card-info">
                <h3>
                    {name} {gender === 'male' ? '♂' : '♀'}
                </h3>

                <p>{description}</p>

                {isReserved !== undefined && (
                    <div className={`reservation-badge ${isReserved ? 'reserved' : 'free'}`}>
                        {isReserved ? t('puppies.reserved') : t('puppies.free')}
                    </div>
                )}
            </div>

            {/* ZMĚNA: Obalení lightboxu do createPortal */}
            {isLightboxOpen && hasImages && createPortal(
                <div className="dog-lightbox-overlay" onClick={closeLightbox}>
                    <div className="dog-lightbox-content" onClick={(e) => e.stopPropagation()}>

                        <img
                            src={images[currentImgIndex].url}
                            alt={`${name} - foto ${currentImgIndex + 1}`}
                            className="dog-lightbox-img"
                        />

                        {images.length > 1 && (
                            <>
                                <button className="lightbox-nav-btn prev" onClick={prevImage} aria-label="Předchozí fotka">
                                    &#10094;
                                </button>
                                <button className="lightbox-nav-btn next" onClick={nextImage} aria-label="Další fotka">
                                    &#10095;
                                </button>
                                <div className="lightbox-counter">
                                    {currentImgIndex + 1} / {images.length}
                                </div>
                            </>
                        )}

                        <button className="lightbox-close-btn" onClick={closeLightbox} aria-label="Zavřít galerii">
                            &times;
                        </button>
                    </div>
                </div>,
                document.body // Říká Reactu: Vyrenderuj tohle na konec <body>
            )}
        </div>
    );
}