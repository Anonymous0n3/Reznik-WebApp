import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import funkce pro překlad
import './Navbar.css';

export default function Navbar() {
    // 't' je funkce, kterou překládáme texty. 'i18n' používáme pro změnu jazyka.
    const { t, i18n } = useTranslation();

    // Funkce pro přepnutí jazyka
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
            </ul>

            {/* Přepínač jazyků */}
            <div className="language-switcher">
                <button
                    className={i18n.language === 'cs' ? 'active-lang' : ''}
                    onClick={() => changeLanguage('cs')}
                >
                    CZ
                </button>
                <span className="lang-divider">|</span>
                <button
                    className={i18n.language === 'en' ? 'active-lang' : ''}
                    onClick={() => changeLanguage('en')}
                >
                    EN
                </button>
            </div>
        </nav>
    );
}