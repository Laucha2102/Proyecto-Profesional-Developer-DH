import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; 
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    const numeroDeTelefono = "5493813001717"; 
    
    const mensaje = encodeURIComponent("¡Hola! Tengo una consulta sobre Digital Booking.");
    
    const whatsappUrl = `https://wa.me/3813001717?text=${mensaje}`;

    return (
        <a 
            href={whatsappUrl} 
            className="whatsapp-float-button"
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Contactar por WhatsApp"
        >
            <FaWhatsapp className="whatsapp-icon" />
        </a>
    );
};

export default WhatsAppButton;