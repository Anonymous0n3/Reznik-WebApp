import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import lokalizace
import DogCard from '../components/common/DogCard';
import './Litters.css';

// Nová pomocná komponenta pro jeden plánovaný vrh
function PlannedLitterCard({ litter }) {
    const { t } = useTranslation(); // 2. Hook pro tuto komponentu
    const [showReservations, setShowReservations] = useState(false);

    return (
        <div className="planned-card">
            <h2>{t('litters.litterWord')}: {litter.dam} ♀ × {litter.sire} ♂</h2>

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
                {t('litters.reserved')}: <strong>{litter.reservations.length} {t('litters.interested')}</strong>
                <span className="dropdown-arrow">{showReservations ? '▲' : '▼'}</span>
            </div>

            {showReservations && (
                <div className="reservations-list">
                    <h4>{t('litters.reservationsListTitle')}:</h4>
                    <ul>
                        {litter.reservations.length > 0 ? (
                            litter.reservations.map(res => (
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
    const { t } = useTranslation(); // 3. Hook pro hlavní komponentu

    // Testovací data (v reálu se budou texty 'description' tahat z DB už ve správném jazyce)
    const currentPuppies = [
        {
            id: 101,
            name: 'Argo (Vrh A)',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=500&q=60',
            description: 'Zelený obojek. Velmi aktivní a zvědavý pejsek.',
            isReserved: true,
        },
        {
            id: 102,
            name: 'Aura (Vrh A)',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=60',
            description: 'Červený obojek. Klidnější fenka, vhodná do rodiny s dětmi.',
            isReserved: false,
        }
    ];

    const plannedLitters = [
        {
            id: 201,
            sire: 'Max',
            dam: 'Bella',
            expectedDate: 'Podzim 2026',
            expectedCount: '6-8 štěňat',
            description: 'Očekáváme vyrovnaná štěňata s výborným předpokladem pro výstavy i sport.',
            reservations: [
                { id: 1, name: 'Rodina Novákova', preferredGender: 'male' },
                { id: 2, name: 'Jan K.', preferredGender: 'female' },
                { id: 3, name: 'Petra S.', preferredGender: 'any' },
                { id: 4, name: 'Zarezervováno (Německo)', preferredGender: 'male' }
            ]
        },
        {
            id: 202,
            sire: 'Bady',
            dam: 'Luna',
            expectedDate: 'Jaro 2027',
            expectedCount: '4-6 štěňat',
            description: 'První vrh naší Luny. Očekáváme klidné a vyrovnané povahy.',
            reservations: [
                { id: 5, name: 'Karel Z.', preferredGender: 'female' }
            ]
        }
    ];

    return (
        <div className="litters-page">
            {status === 'current' ? (
                <>
                    <h1>{t('litters.currentTitle')}</h1>
                    <p className="litters-intro">{t('litters.currentIntro')}</p>
                    <div className="puppies-grid">
                        {currentPuppies.length > 0 ? (
                            currentPuppies.map(puppy => (
                                <DogCard key={puppy.id} {...puppy} />
                            ))
                        ) : (
                            <p>{t('litters.noCurrentPuppies')}</p>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h1>{t('litters.plannedTitle')}</h1>
                    <p className="litters-intro">{t('litters.plannedIntro')}</p>
                    <div className="planned-grid">
                        {plannedLitters.length > 0 ? (
                            plannedLitters.map(litter => (
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