import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Navbar() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/">{t('nav.home')}</NavLink>
            </div>

            <ul className="navbar-links">
                <li><NavLink to="/holky">{t('nav.girls')}</NavLink></li>
                <li><NavLink to="/kluci">{t('nav.boys')}</NavLink></li>
                <li><NavLink to="/aktualni-vrhy">{t('nav.puppies')}</NavLink></li>
                <li><NavLink to="/planovane-vrhy">{t('nav.planned')}</NavLink></li>
                <li><NavLink to="/galerie">{t('nav.gallery')}</NavLink></li>
                <li><NavLink to="/kontakt">{t('nav.contact')}</NavLink></li>
                <li><NavLink to="/login" className="admin-link">Admin</NavLink></li>
            </ul>

            <div className="language-switcher">
                <button
                    className={i18n.language === 'cs' ? 'active-lang' : ''}
                    onClick={() => changeLanguage('cs')}
                    aria-label="Přepnout na češtinu"
                >
                    CZ
                </button>
                <span className="lang-divider">|</span>
                <button
                    className={i18n.language === 'en' ? 'active-lang' : ''}
                    onClick={() => changeLanguage('en')}
                    aria-label="Switch to English"
                >
                    EN
                </button>
            </div>
        </nav>
    );
}