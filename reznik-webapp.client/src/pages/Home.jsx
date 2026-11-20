import { useTranslation } from 'react-i18next';
import './Home.css';

import heroImage from '../assets/main_log.jpg';

export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="home-page">
            <header
                className="hero-banner"
                style={{
                    height: '900px',
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff'
                }}
            >
                <div className="banner-content">
                    <h1>{t('home.welcomeTitle')}</h1>
                    <p>{t('home.welcomeSub')}</p>
                </div>
            </header>

            <section className="intro-section">
                <h2>{t('home.aboutTitle')}</h2>
                <p>{t('home.aboutText')}</p>
            </section>
        </div>
    );
}