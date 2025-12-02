import React from 'react';
import { Link } from 'react-router-dom'; 
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';
import logo from '../../assets/logo3.png'; 

const Footer = () => {
    const currentYear = new Date().getFullYear(); 

    return (
        <footer className="footer-container">
            <div className="footer-content">
                
                <div className="footer-copyright">
                    <img src={logo} alt="Logo de ReservaYa" className="footer-logo-img" />
                    <span>©{currentYear} ReservaYa</span>
                    <p>¡Tu alojamiento, al instante!</p>
                </div>

                <div className="footer-nav">
                    <h4>Navegación</h4>
                    <Link to="/">Home</Link>
                    <Link to="/login">Iniciar sesión</Link>
                    <Link to="/register">Crear cuenta</Link>
                </div>

                <div className="footer-nav">
                    <h4>Soporte</h4>
                    <Link to="/faq">Preguntas Frecuentes</Link>
                    <Link to="/contacto">Contacto</Link>
                    <Link to="/politicas-privacidad">Políticas de Privacidad</Link>
                </div>
                
                <div className="footer-social">
                    <h4>Síguenos</h4>
                    <div className="social-icons-wrapper">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;