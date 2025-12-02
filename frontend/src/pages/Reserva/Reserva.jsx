import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById, getReservasPorProducto, crearReserva } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import { parseISO, eachDayOfInterval, format } from 'date-fns';
import './Reserva.css';

registerLocale('es', es);

const Reserva = () => {
    const { productoId } = useParams();
    const navigate = useNavigate();
    const { usuario, authToken } = useAuth(); 

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fechasOcupadas, setFechasOcupadas] = useState([]);

    const [rangoFechas, setRangoFechas] = useState([null, null]);
    const [fechaInicio, fechaFin] = rangoFechas;

    const [nombre, setNombre] = useState(usuario?.nombre || ''); 
    const [apellido, setApellido] = useState(usuario?.apellido || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [ciudadUsuario, setCiudadUsuario] = useState('');


    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const dataProducto = await getProductoById(productoId);
                setProducto(dataProducto);

                const dataReservas = await getReservasPorProducto(productoId);
                const fechasDeshabilitadas = [];
                dataReservas.forEach(reserva => {
                    const inicio = parseISO(reserva.fechaInicio);
                    const fin = parseISO(reserva.fechaFin);
                    const intervalo = eachDayOfInterval({ start: inicio, end: fin });
                    fechasDeshabilitadas.push(...intervalo);
                });
                setFechasOcupadas(fechasDeshabilitadas);

            } catch (err) {
                setError('Error al cargar los datos para la reserva.');
            }
            setLoading(false);
        };
        cargarDatos();
    }, [productoId]);

    const handleConfirmarReserva = async () => {
        if (!fechaInicio || !fechaFin) {
            setError("Por favor, selecciona un rango de fechas.");
            return;
        }
        if (!nombre || !apellido || !email) {
             setError("Por favor, completa tus datos personales.");
            return;
        }

        setError('');

        const reservaData = {
            productoId: parseInt(productoId),
            fechaInicio: format(fechaInicio, 'yyyy-MM-dd'),
            fechaFin: format(fechaFin, 'yyyy-MM-dd')
        };

        try {
            await crearReserva(reservaData, authToken);
            alert("¡Reserva realizada con éxito!"); 
            navigate('/'); 

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="reserva-container"><p>Cargando...</p></div>;
    if (error && !producto) return <div className="reserva-container"><p>{error}</p></div>;

    return (
        <div className="reserva-container">
            <div className="reserva-grid">
                
                <div className="reserva-col-izquierda">
                    <div className="reserva-bloque">
                        <h3>Completa tus datos</h3>
                        <form className="reserva-datos-usuario">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input 
                                    type="text" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input 
                                    type="text" 
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Ciudad</label>
                                <input 
                                    type="text" 
                                    value={ciudadUsuario}
                                    onChange={(e) => setCiudadUsuario(e.target.value)}
                                    placeholder="Ej: Tucumán"
                                    required 
                                />
                            </div>
                        </form>
                    </div>

                    <div className="reserva-bloque">
                        <h3>Selecciona tu fecha de reserva</h3>
                        <div className="calendario-wrapper-reserva">
                            <DatePicker
                                inline
                                monthsShown={2}
                                excludeDates={fechasOcupadas}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                locale="es"
                                selectsRange={true}
                                startDate={fechaInicio}
                                endDate={fechaFin}
                                onChange={(update) => setRangoFechas(update)}
                            />
                        </div>
                    </div>
                </div>

                <div className="reserva-col-derecha">
                    <div className="reserva-bloque detalle-reserva-card">
                        <h3>Detalle de la reserva</h3>
                        {producto && (
                            <>
                                <img 
                                    src={producto.imagenes[0]?.urlImagen} 
                                    alt={producto.nombre} 
                                    className="reserva-producto-img"
                                />
                                <p className="reserva-producto-cat">{producto.categoria.titulo}</p>
                                <h4>{producto.nombre}</h4>
                                <p className="reserva-producto-ubicacion">
                                    {producto.direccion}, {producto.ciudad.nombre}
                                </p>
                                <hr />
                                <div className="reserva-fechas-detalle">
                                    <span>Check-in:</span>
                                    <strong>{fechaInicio ? format(fechaInicio, 'dd/MM/yyyy') : '---'}</strong>
                                </div>
                                <div className="reserva-fechas-detalle">
                                    <span>Check-out:</span>
                                    <strong>{fechaFin ? format(fechaFin, 'dd/MM/yyyy') : '---'}</strong>
                                </div>
                                <hr />
                                
                                {error && <p className="msg-error small">{error}</p>}
                                
                                <button 
                                    className="reserva-confirmar-btn"
                                    onClick={handleConfirmarReserva}
                                >
                                    Confirmar Reserva
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reserva;