import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Stav pro otevření/zavření menu

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="FCI_logo.svg" alt="FCI Logo" className="fci-logo" />
                <NavLink to="/">{t('nav.home')}</NavLink>
            </div>

            {/* Hamburger tlačítko (zobrazí se jen na mobilu) */}
            <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
                ☰
            </button>

            {/* Přidáme třídu 'active' pokud je menu otevřené */}
            <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                <li><NavLink to="/holky" onClick={toggleMenu}>{t('nav.girls')}</NavLink></li>
                <li><NavLink to="/kluci" onClick={toggleMenu}>{t('nav.boys')}</NavLink></li>
                <li><NavLink to="/aktualni-vrhy" onClick={toggleMenu}>{t('nav.puppies')}</NavLink></li>
                <li><NavLink to="/planovane-vrhy" onClick={toggleMenu}>{t('nav.planned')}</NavLink></li>
                <li><NavLink to="/galerie" onClick={toggleMenu}>{t('nav.gallery')}</NavLink></li>
                <li><NavLink to="/kontakt" onClick={toggleMenu}>{t('nav.contact')}</NavLink></li>
                <li><NavLink to="/login" className="admin-link" onClick={toggleMenu}>Admin</NavLink></li>
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