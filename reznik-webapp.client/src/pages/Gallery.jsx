import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import lokalizace
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import './Gallery.css';

export default function Gallery() {
    const { t } = useTranslation(); // 2. Získání překladové funkce

    // Testovací data s překlady pomocí t()
    const images = [
        {
            id: 1,
            title: t('gallery.img1Title'),
            description: t('gallery.img1Desc'),
            src: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1200&auto=format&fit=crop',
            thumb: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: 2,
            title: t('gallery.img2Title'),
            src: 'https://images.unsplash.com/photo-1537151608804-ea2f1a3089d8?q=80&w=1200&auto=format&fit=crop',
            thumb: 'https://images.unsplash.com/photo-1537151608804-ea2f1a3089d8?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: 3,
            title: t('gallery.img3Title'),
            src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop',
            thumb: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: 4,
            title: t('gallery.img4Title'),
            src: 'https://images.unsplash.com/photo-1598134493179-51332e56807f?q=80&w=1200&auto=format&fit=crop',
            thumb: 'https://images.unsplash.com/photo-1598134493179-51332e56807f?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: 5,
            title: t('gallery.img5Title'),
            src: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop',
            thumb: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: 6,
            title: t('gallery.img6Title'),
            src: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?q=80&w=1200&auto=format&fit=crop',
            thumb: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?q=80&w=400&auto=format&fit=crop'
        }
    ];

    const [index, setIndex] = useState(-1);

    return (
        <div className="gallery-page">
            {/* 3. Nahrazení pevných textů */}
            <h1>{t('gallery.title')}</h1>
            <p className="gallery-intro">{t('gallery.intro')}</p>

            <div className="gallery-grid">
                {images.map((img, i) => (
                    <div key={img.id} className="gallery-item" onClick={() => setIndex(i)}>
                        <img src={img.thumb} alt={img.title} />
                        <div className="gallery-item-overlay">
                            <span>{img.title}</span>
                        </div>
                    </div>
                ))}
            </div>

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