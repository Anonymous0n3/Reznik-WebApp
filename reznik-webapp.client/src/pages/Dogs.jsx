import DogCard from '../components/common/DogCard';
import './Dogs.css'; // Vytvoříme níže pro pěknou mřížku
import { useTranslation } from 'react-i18next';

export default function Dogs({ gender }) {
    const { t } = useTranslation();
    // Testovací data (později je nahradíš voláním na tvé ASP.NET API)
    const mockDogs = [
        {
            id: 1,
            name: 'Bella',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=60',
            description: 'Výborná fena s mnoha výstavními tituly. Velmi klidná povaha.',
        },
        {
            id: 2,
            name: 'Max',
            gender: 'male',
            image: 'https://images.unsplash.com/photo-1537151608804-ea2f1a3089d8?auto=format&fit=crop&w=500&q=60',
            description: 'Mladý a energický pes, skvělý aportér. Čeká na uchovnění.',
        },
        {
            id: 3,
            name: 'Luna',
            gender: 'female',
            image: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?auto=format&fit=crop&w=500&q=60',
            description: 'Skvělá matka našeho vrhu A. Miluje děti.',
        }
    ];

    // Vyfiltrujeme psy podle toho, zda jsme na stránce "Holky" nebo "Kluci"
    const filteredDogs = mockDogs.filter(dog => dog.gender === gender);

    const pageTitle = gender === 'female' ? t('dogs.titleGirls') : t('dogs.titleBoys');
    const introText = gender === 'female' ? t('dogs.introGirls') : t('dogs.introBoys');

    return (
        <div className="dogs-page">
            <h1>{pageTitle}</h1>
            <p className="dogs-intro">
                {introText}
            </p>

            <div className="dogs-grid">
                {filteredDogs.length > 0 ? (
                    filteredDogs.map(dog => (
                        <DogCard
                            key={dog.id}
                            name={dog.name}
                            image={dog.image}
                            description={dog.description}
                            gender={dog.gender}
                        />
                    ))
                ) : (
                    <p>Zatím zde nejsou žádné záznamy.</p>
                )}
            </div>
        </div>
    );
}