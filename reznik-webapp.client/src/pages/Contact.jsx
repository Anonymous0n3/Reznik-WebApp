import React from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

export default function Contact() {
    const { t } = useTranslation();

    return (
        <div className="contact-page">
            <h1>{t('contact.title')}</h1>
            <p className="contact-intro">
                {t('contact.intro')}
            </p>

            <div className="contact-container">
                <div className="contact-info">
                    <h2>{t('contact.infoTitle')}</h2>
                    <ul>
                        <li><strong>{t('contact.addressLabel')}:</strong> {t('contact.addressValue')}</li>
                        <li><strong>{t('contact.phoneLabel')}:</strong> {t('contact.phonePlaceHolder')}</li>
                        <li><strong>{t('contact.emailLabel')}:</strong> {t('contact.emailPlaceHolder')}</li>
                        <li><strong>{t('contact.instagramLabel')}:</strong> {t('contact.instagramPlaceHolder')}</li>
                    </ul>

                    <div className="map-placeholder">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d635.2943888871847!2d15.126687808239543!3d50.437793339033384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470ea9542004c445%3A0xc1b811634e0d5ced!2zTMOpa8Ohcm5hIERvbG7DrSBCb3Vzb3Ygcy5yLm8u!5e0!3m2!1scs!2scz!4v1785246712811!5m2!1scs!2scz" width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}