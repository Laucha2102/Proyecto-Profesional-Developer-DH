import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, eachDayOfInterval } from 'date-fns';

import { 
    getProductoById, 
    getReservasPorProducto, 
    getPuntuacionesPorProducto, 
    crearPuntuacion 
} from '../../services/apiService';

import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon
} from 'react-share';
import { Rating } from 'react-simple-star-rating';
import { useAuth } from '../../context/AuthContext';

import './ProductoDetalle.css';

const StarRating = ({ ratingValue }) => {
    return (
        <Rating
            initialValue={ratingValue} 
            readonly={true}
            size={20}
            allowFraction={true}
            fillColor="#1D8A99"
        />
    );
};

const ProductoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // <-- Hook para navegar
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fechasOcupadas, setFechasOcupadas] = useState([]);
    const location = useLocation();
    const shareUrl = window.location.href; 

    const { isAuthenticated, authToken } = useAuth(); // <-- Obtener Auth
    const [puntuaciones, setPuntuaciones] = useState([]);
    const [loadingPuntuaciones, setLoadingPuntuaciones] = useState(true);
    const [nuevaPuntuacion, setNuevaPuntuacion] = useState(0); // Valor 1-5
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [puntuacionError, setPuntuacionError] = useState("");

    const cargarPuntuaciones = async () => {
        setLoadingPuntuaciones(true);
        try {
            const data = await getPuntuacionesPorProducto(id);
            setPuntuaciones(data);
        } catch (err) { console.error("Error cargando puntuaciones:", err); }
        setLoadingPuntuaciones(false);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                setError(''); setProducto(null); setFechasOcupadas([]); setPuntuaciones([]);
                
                const dataProducto = await getProductoById(id);
                setProducto(dataProducto);

                const dataReservas = await getReservasPorProducto(id);
                const fechasDeshabilitadas = [];
                dataReservas.forEach(reserva => {
                    const inicio = parseISO(reserva.fechaInicio);
                    const fin = parseISO(reserva.fechaFin);
                    const intervalo = eachDayOfInterval({ start: inicio, end: fin });
                    fechasDeshabilitadas.push(...intervalo);
                });
                setFechasOcupadas(fechasDeshabilitadas);
                
                await cargarPuntuaciones();

            } catch (err) {
                setError('Error al cargar los datos del producto.');
            }
            setLoading(false);
        };
        cargarDatos();
    }, [id]);

    const politicasAgrupadas = useMemo(() => {
        if (!producto || !producto.politicas) return {};
        return producto.politicas.reduce((acc, politica) => {
            const tipo = politica.tipo;
            if (!acc[tipo]) acc[tipo] = [];
            acc[tipo].push(politica);
            return acc;
        }, {});
    }, [producto]);

    const promedioPuntuacion = useMemo(() => {
        if (puntuaciones.length === 0) return 0;
        const total = puntuaciones.reduce((acc, p) => acc + p.valor, 0);
        return (total / puntuaciones.length).toFixed(1);
    }, [puntuaciones]);

    const handleRating = (rate) => {
        setNuevaPuntuacion(rate); // Usa 1-5
    };

    const handleSubmitPuntuacion = async (e) => {
        e.preventDefault();
        setPuntuacionError('');
        if (nuevaPuntuacion === 0) {
            setPuntuacionError("Por favor, selecciona al menos una estrella.");
            return;
        }
        try {
            const puntuacionData = {
                productoId: parseInt(id),
                valor: nuevaPuntuacion, // Envía 1-5
                comentario: nuevoComentario
            };
            await crearPuntuacion(puntuacionData, authToken);
            setNuevaPuntuacion(0);
            setNuevoComentario('');
            await cargarPuntuaciones();
        } catch (err) {
            setPuntuacionError(err.message || "Error al enviar la puntuación.");
        }
    };

    if (loading) {
        return <div className="detalle-container"><p>Cargando...</p></div>;
    }
    if (error) {
        return <div className="detalle-container"><p>{error}</p></div>;
    }
    if (!producto) {
        return <div className="detalle-container"><p>Producto no encontrado.</p></div>;
    }

    return (
        <div className="detalle-container">
            {/* Header del producto */}
            <div className="detalle-header">
                <div className="detalle-header-info">
                    <p>{producto.categoria ? producto.categoria.titulo : 'Categoría'}</p>
                    <h2>{producto.nombre}</h2>
                </div>
                <Link to="/" className="detalle-back-link">
                    &larr; Volver
                </Link>
                <button 
            className="detalle-button" 
            style={{backgroundColor: '#F0572D', marginLeft: '15px'}}
            onClick={() => navigate(`/administracion/productos/editar/${id}`)}>
            Editar Producto
        </button>
            </div>

            <div className="detalle-ubicacion-share">
                <div className="ubicacion-info">
                    <span>{producto.direccion}, {producto.ciudad.nombre}, {producto.ciudad.pais}</span>
                </div>
                <div className="detalle-puntuacion-promedio">
                    <StarRating ratingValue={promedioPuntuacion} />
                    <span>{promedioPuntuacion} ({puntuaciones.length} reseñas)</span>
                </div>
                <div className="share-info">
                    <span>Compartir:</span>
                    <div className="share-buttons">
                        <FacebookShareButton url={shareUrl} quote={`¡Mira este increíble lugar: ${producto.nombre}!`} hashtag="#digitalbooking">
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={`¡Mira este increíble lugar: ${producto.nombre}!`}>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton url={shareUrl} title={`¡Mira este increíble lugar: ${producto.nombre}!`}>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </div>
                </div>
            </div>

            <div className="detalle-galeria">
                {producto.imagenes && producto.imagenes.length > 0 ? (
                    <div className="galeria-grid">
                        <div className="galeria-principal">
                            <img src={producto.imagenes[0].urlImagen} alt={producto.imagenes[0].titulo} />
                        </div>
                        <div className="galeria-secundaria">
                            {producto.imagenes.slice(1, 5).map((imagen, index) => (
                                <div key={index} className="galeria-item">
                                    <img src={imagen.urlImagen} alt={imagen.titulo} />
                                </div>
                            ))}
                        </div>
                        <div className="galeria-ver-mas">
                            <a href="#">Ver más</a>
                        </div>
                    </div>
                ) : (
                    <p>Este producto no tiene imágenes.</p>
                )}
            </div>

            <div className="detalle-descripcion">
                <h3>Descripción</h3>
                <p>{producto.descripcion}</p>
            </div>

            <div className="detalle-caracteristicas">
                <h3>Características</h3>
                <ul>
                    {producto.caracteristicas && producto.caracteristicas.map(car => (
                        <li key={car.id}>
                            <i className={car.icono}></i> {car.nombre}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="detalle-disponibilidad">
                 <h3>Fechas disponibles</h3>
                 <div className="calendario-wrapper">
                    <DatePicker
                        inline
                        monthsShown={2}
                        excludeDates={fechasOcupadas}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        selectsRange={false}
                        disabledKeyboardNavigation
                    />
                </div>
                
                <div className="detalle-iniciar-reserva">
                    <p className="detalle-precio">Precio por noche: <span>${producto.precio}</span></p>
                    <p>¡Agrega tus fechas de viaje para obtener precios exactos!</p>
                    <button 
                        className="detalle-button" 
                        onClick={() => {
                            if (isAuthenticated) {
                                navigate(`/producto/${id}/reserva`);
                            } else {
                                navigate('/login'); 
                            }
                        }}
                    >
                        Iniciar Reserva
                    </button>
                    {!isAuthenticated && (
                        <p className="reserva-login-requerido">
                            Para realizar una reserva necesitas <Link to="/login">iniciar sesión</Link>.
                        </p>
                    )}
                </div>
            </div>

            <div className="detalle-politicas">
                 <h3 className="titulo-subrayado">Qué tenés que saber</h3>
                <div className="politicas-grid">
                    {Object.keys(politicasAgrupadas).map((tipoPolitica) => (
                        <div key={tipoPolitica} className="politica-columna">
                            <h4>{tipoPolitica}</h4>
                            <ul>
                                {politicasAgrupadas[tipoPolitica].map((politica) => (
                                    <li key={politica.id}>
                                        <strong>{politica.titulo}:</strong> {politica.descripcion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            
            {isAuthenticated && (
                <div className="detalle-nueva-puntuacion">
                    <h3 className="titulo-subrayado">Deja tu opinión</h3>
                    <form onSubmit={handleSubmitPuntuacion}>
                        <div className="form-group">
                            <label>Tu puntuación:</label>
                            <Rating
                                onClick={handleRating}
                                initialValue={nuevaPuntuacion} 
                                size={25}
                                fillColor="#1D8A99"
                                transition
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comentario">Tu comentario (opcional):</label>
                            <textarea
                                id="comentario"
                                value={nuevoComentario}
                                onChange={(e) => setNuevoComentario(e.target.value)}
                                placeholder="Escribe tu reseña aquí..."
                            ></textarea>
                        </div>
                        {puntuacionError && <p className="msg-error">{puntuacionError}</p>}
                        <button type="submit" className="detalle-button">Enviar reseña</button>
                    </form>
                </div>
            )}

            <div className="detalle-lista-puntuaciones">
                <h3 className="titulo-subrayado">Reseñas ({puntuaciones.length})</h3>
                {loadingPuntuaciones ? (
                    <p>Cargando reseñas...</p>
                ) : (
                    puntuaciones.length === 0 ? (
                        <p>Este producto aún no tiene reseñas. ¡Sé el primero!</p>
                    ) : (
                        <div className="puntuaciones-grid">
                            {puntuaciones.map(p => (
                                <div key={p.id} className="puntuacion-card">
                                    <StarRating ratingValue={p.valor} /> {/* <-- CORREGIDO */}
                                    <p className="puntuacion-usuario">
                                        <strong>{p.user.nombre} {p.user.apellido}</strong> - {p.fecha}
                                    </p>
                                    <p className="puntuacion-comentario">{p.comentario}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ProductoDetalle;