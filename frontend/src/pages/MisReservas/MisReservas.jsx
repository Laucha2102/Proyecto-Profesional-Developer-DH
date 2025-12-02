import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMisReservas } from '../../services/apiService';
import './MisReservas.css';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { Link } from 'react-router-dom';

const MisReservas = () => {
    const { authToken } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReservas = async () => {
            if (authToken) {
                try {
                    const data = await getMisReservas(authToken);
                    setReservas(data);
                } catch (error) {
                    setError("Error al cargar tus reservas.");
                }
                setLoading(false);
            }
        };
        fetchReservas();
    }, [authToken]); 

    if (loading) {
        return <div className="mis-reservas-container"><p>Cargando mis reservas...</p></div>;
    }

    if (error) {
        return <div className="mis-reservas-container"><p>{error}</p></div>;
    }

    return (
        <div className="mis-reservas-container">
            <h2>Mis Reservas</h2>
            
            {reservas.length === 0 ? (
                <p>Aún no has realizado ninguna reserva.</p>
            ) : (
                <div className="reservas-grid">
                    {reservas.map(reserva => (
                        <div key={reserva.id} className="reserva-card">
                            {reserva.producto && (
                                <>
                                    <img 
                                        src={reserva.producto.imagenes[0]?.urlImagen} 
                                        alt={reserva.producto.nombre} 
                                        className="reserva-card-img"
                                    />
                                    <div className="reserva-card-info">
                                        <h3>{reserva.producto.nombre}</h3>
                                        <p><strong>Check-in:</strong> {format(parseISO(reserva.fechaInicio), 'dd MMMM yyyy', { locale: es })}</p>
                                        <p><strong>Check-out:</strong> {format(parseISO(reserva.fechaFin), 'dd MMMM yyyy', { locale: es })}</p>
                                        <Link 
                                            to={`/producto/${reserva.producto.id}`} 
                                            className="detalle-button-reserva"
                                        >
                                            Ver producto
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisReservas;