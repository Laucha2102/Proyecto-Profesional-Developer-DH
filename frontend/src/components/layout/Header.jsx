import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import logo from '../../assets/logo3.png';
import './Header.css';

const Header = () => {
    const { isAuthenticated, usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    const inicial = usuario ? usuario.email[0].toUpperCase() : '?';

    // Función auxiliar para saber si es admin
    const isAdmin = () => {
        // Verifica si existe usuario, si tiene la propiedad roles y si incluye 'ROLE_ADMIN'
        return usuario && usuario.roles && usuario.roles.includes('ROLE_ADMIN');
    };

    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/" className="header-logo-container">
                    <img src={logo} alt="Logo de ReservaYa" className="header-logo-img" />
                    <span className="header-slogan">¡Tu alojamiento, al instante!</span>
                </Link>
                <nav className="header-nav">
                    {isAuthenticated ? (
                        <div className="user-info">
                            
                            {/* --- INICIO DEL CAMBIO CORREGIDO --- */}
                            {isAdmin() && (
                                <Link to="/administracion" className="user-menu-link" style={{ marginRight: '15px', fontWeight: 'bold', color: '#1dbeb4' }}>
                                    Administrar
                                </Link>
                            )}
                            {/* --- FIN DEL CAMBIO --- */}

                            <div className="user-avatar">{inicial}</div>
                            <span className="user-greeting">Hola, {usuario.email}</span>
                            
                            <Link to="/mis-reservas" className="user-menu-link">
                                Mis Reservas
                            </Link>

                            <button 
                                onClick={handleLogout} 
                                className="header-button-logout"
                                title="Cerrar Sesión" 
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/register">
                                <button className="header-button secondary">Crear cuenta</button>
                            </Link>
                            <Link to="/login">
                                <button className="header-button primary">Iniciar sesión</button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;