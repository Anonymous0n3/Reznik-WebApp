import './DogCard.css';

import { useTranslation } from 'react-i18next';

export default function DogCard({ name, image, description, isReserved, gender }) {
    const { t } = useTranslation();

    return (
        <div className="dog-card">
            <img
                src={image || '/placeholder-dog.jpg'}
                alt={`Fotografie psa jménem ${name}`}
            />

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
        </div>
    );
}