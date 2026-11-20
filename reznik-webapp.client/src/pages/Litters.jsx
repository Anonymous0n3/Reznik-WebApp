import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DogCard from '../components/common/DogCard';
import './Litters.css';

// Vyměňte stávající PlannedLitterCard za tuto verzi:

function PlannedLitterCard({ litter }) {
    const { t } = useTranslation();
    const [showReservations, setShowReservations] = useState(false);

    const [reservations, setReservations] = useState([]);
    const [isLoadingRes, setIsLoadingRes] = useState(false);

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoadingRes(true);
            try {
                const response = await fetch(`/api/Reservations/bylitter/${litter.id}`);
                if (response.ok) {
                    setReservations(await response.json());
                }
            } catch (err) {
                console.error("Chyba při načítání rezervací", err);
            } finally {
                setIsLoadingRes(false);
            }
        };
        fetchReservations();
    }, [litter.id]);

    // ZMĚNA: Extrakce profilových fotek rodičů (bereme vždy první fotku z pole)
    const damHasImages = litter.dam?.images && litter.dam.images.length > 0;
    const damImage = damHasImages ? litter.dam.images[0].url : '/placeholder-dog.jpg';

    const sireHasImages = litter.sire?.images && litter.sire.images.length > 0;
    const sireImage = sireHasImages ? litter.sire.images[0].url : '/placeholder-dog.jpg';

    return (
        <div className="planned-card">

            {/* ZMĚNA: Přidána vizuální hlavička s fotkami rodičů */}
            <div className="planned-parents-header">
                <div className="parent-profile dam">
                    <img src={damImage} alt={litter.dam?.name || 'Neznámá'} className="parent-img" />
                    <span className="parent-name">{litter.dam?.name || 'Neznámá'} ♀</span>
                    <span className="parent-role">{t('litters.dam', 'Matka')}</span>
                </div>

                <div className="parents-divider">
                    <span>×</span>
                </div>

                <div className="parent-profile sire">
                    <img src={sireImage} alt={litter.sire?.name || 'Neznámý'} className="parent-img" />
                    <span className="parent-name">{litter.sire?.name || 'Neznámý'} ♂</span>
                    <span className="parent-role">{t('litters.sire', 'Otec')}</span>
                </div>
            </div>

            <div className="planned-details">
                <p><strong>{t('litters.expectedDate')}:</strong> {litter.expectedDate}</p>
                <p><strong>{t('litters.expectedCount')}:</strong> {litter.expectedCount}</p>
            </div>

            <p className="planned-desc">{litter.description}</p>

            <div
                className="reservation-status interactive"
                onClick={() => setShowReservations(!showReservations)}
                title={t('litters.clickToToggle')}
            >
                {t('litters.reserved')}: <strong>{isLoadingRes ? '...' : reservations.length} {t('litters.interested')}</strong>
                <span className="dropdown-arrow">{showReservations ? '▲' : '▼'}</span>
            </div>

            {showReservations && (
                <div className="reservations-list">
                    <h4>{t('litters.reservationsListTitle')}:</h4>
                    <ul>
                        {reservations.length > 0 ? (
                            reservations.map(res => (
                                <li key={res.id}>
                                    <span className="res-name">{res.name}</span>
                                    <span className="res-gender">
                                        {t('litters.preference')}: {res.preferredGender === 'male' ? t('litters.male') : res.preferredGender === 'female' ? t('litters.female') : t('litters.any')}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li>{t('litters.noReservations')}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function Litters({ status }) {
    const { t } = useTranslation();

    const [litters, setLitters] = useState([]);
    const [puppies, setPuppies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const littersRes = await fetch('/api/Litters');
                if (!littersRes.ok) throw new Error('Failed to fetch litters');
                const allLitters = await littersRes.json();

                const activeLitters = allLitters.filter(l => l.status === status);
                setLitters(activeLitters);

                if (status === 'current') {
                    const puppiesPromises = activeLitters.map(l =>
                        fetch(`/api/Puppies/bylitter/${l.id}`).then(res => res.json())
                    );

                    const puppiesArrays = await Promise.all(puppiesPromises);
                    setPuppies(puppiesArrays.flat());
                }
            } catch (err) {
                setError(t('common.errorNetwork', 'Chyba sítě při načítání dat.'));
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [status, t]);

    return (
        <div className="litters-page">
            {isLoading && <p className="loading-text">{t('common.loading', 'Načítám...')}</p>}
            {error && <p className="error-text">{error}</p>}

            {!isLoading && !error && status === 'current' && (
                <>
                    <h1>{t('litters.currentTitle')}</h1>
                    <p className="litters-intro">{t('litters.currentIntro')}</p>
                    <div className="puppies-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {puppies.length > 0 ? (
                            puppies.map(puppy => (
                                <DogCard
                                    key={puppy.id}
                                    name={puppy.name}
                                    // ZMĚNA ZDE: image={puppy.imageUrl} bylo nahrazeno za images={puppy.images}
                                    images={puppy.images}
                                    description={puppy.colorInfo}
                                    gender={puppy.gender}
                                    isReserved={puppy.status !== 'available'}
                                />
                            ))
                        ) : (
                            <p>{t('litters.noCurrentPuppies')}</p>
                        )}
                    </div>
                </>
            )}

            {!isLoading && !error && status === 'planned' && (
                <>
                    <h1>{t('litters.plannedTitle')}</h1>
                    <p className="litters-intro">{t('litters.plannedIntro')}</p>
                    <div className="planned-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {litters.length > 0 ? (
                            litters.map(litter => (
                                <PlannedLitterCard key={litter.id} litter={litter} />
                            ))
                        ) : (
                            <p>{t('litters.noPlannedLitters')}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}