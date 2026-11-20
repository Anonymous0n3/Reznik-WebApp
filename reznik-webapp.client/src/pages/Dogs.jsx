import React, { useState, useEffect } from 'react';
import DogCard from '../components/common/DogCard';
import './Dogs.css';
import { useTranslation } from 'react-i18next';

export default function Dogs({ gender }) {
    const { t } = useTranslation();

    const [dogs, setDogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const response = await fetch('/api/OurDogs');
                if (response.ok) {
                    const data = await response.json();
                    setDogs(data);
                } else {
                    setError(t('dogs.errorFetch', 'Nepodařilo se načíst data.'));
                }
            } catch (err) {
                setError(t('dogs.errorNetwork', 'Chyba sítě. Zkontrolujte připojení.'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDogs();
    }, []);

    const filteredDogs = dogs.filter(dog => dog.gender === gender);

    const pageTitle = gender === 'female' ? t('dogs.titleGirls') : t('dogs.titleBoys');
    const introText = gender === 'female' ? t('dogs.introGirls') : t('dogs.introBoys');

    return (
        <div className="dogs-page">
            <h1>{pageTitle}</h1>
            <p className="dogs-intro">
                {introText}
            </p>

            {isLoading && <p className="loading-text">{t('common.loading', 'Načítám...')}</p>}
            {error && <p className="error-text">{error}</p>}

            {!isLoading && !error && (
                <div className="dogs-grid">
                    {filteredDogs.length > 0 ? (
                        filteredDogs.map(dog => (
                            <DogCard
                                key={dog.id}
                                name={dog.name}
                                // OPRAVA ZDE: Místo image={dog.imageUrl} dáváme images={dog.images}
                                images={dog.images}
                                description={dog.description}
                                gender={dog.gender}
                            />
                        ))
                    ) : (
                        <p>{t('dogs.empty', 'Zatím zde nejsou žádné záznamy.')}</p>
                    )}
                </div>
            )}
        </div>
    );
}