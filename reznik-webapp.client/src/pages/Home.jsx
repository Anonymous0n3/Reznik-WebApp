import { useTranslation } from 'react-i18next';
import './Home.css';

export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="home-page">
            <header className="hero-banner" style={{ height: '400px', backgroundColor: '#ddd' }}>
                <h1>{t('home.welcomeTitle')}</h1>
                <p>{t('home.welcomeSub')}</p>
            </header>

            <section className="intro-section">
                <h2>{t('home.aboutTitle')}</h2>
                <p>{t('home.aboutText')}</p>
            </section>
        </div>
    );
}