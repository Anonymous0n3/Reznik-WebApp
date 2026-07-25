import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import lokalizace
import './Contact.css';

export default function Contact() {
    const { t } = useTranslation(); // 2. Hook pro překlady

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Odesílaná data:', formData);

        // 3. Překlad i uvnitř alertu
        alert(t('contact.successAlert'));

        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-page">
            <h1>{t('contact.title')}</h1>
            <p className="contact-intro">
                {t('contact.intro')}
            </p>

            <div className="contact-container">
                {/* Levý sloupec: Údaje a mapa */}
                <div className="contact-info">
                    <h2>{t('contact.infoTitle')}</h2>
                    <ul>
                        <li><strong>{t('contact.addressLabel')}</strong> {t('contact.addressValue')}</li>
                        <li><strong>{t('contact.phoneLabel')}</strong> +420 123 456 789</li>
                        <li><strong>{t('contact.emailLabel')}</strong> info@chovatelskastanice.cz</li>
                        <li><strong>{t('contact.instagramLabel')}</strong> @nase_stanice</li>
                    </ul>

                    <div className="map-placeholder">
                        <div className="map-mockup">
                            {t('contact.mapPlaceholder')}
                        </div>
                    </div>
                </div>

                {/* Pravý sloupec: Formulář */}
                <div className="contact-form-wrapper">
                    <h2>{t('contact.formTitle')}</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">{t('contact.nameLabel')}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('contact.namePlaceholder')}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">{t('contact.emailLabel')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t('contact.emailPlaceholder')}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">{t('contact.messageLabel')}</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t('contact.messagePlaceholder')}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-button">
                            {t('contact.submitButton')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}