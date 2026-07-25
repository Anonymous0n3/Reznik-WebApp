import './DogCard.css';
export default function DogCard({ name, image, description, isReserved, gender }) {
    return (
        <div className="dog-card">
            <img src={image || '/placeholder-dog.jpg'} alt={`Fotografie psa ${name}`} />

            <div className="dog-card-info">
                <h3>{name} {gender === 'male' ? '♂' : '♀'}</h3>
                <p>{description}</p>

                {/* Zobrazení stavu rezervace pro štěňata */}
                {isReserved !== undefined && (
                    <div className={`reservation-badge ${isReserved ? 'reserved' : 'free'}`}>
                        {isReserved ? 'Zarezervováno' : 'Volné'}
                    </div>
                )}
            </div>
        </div>
    );
}