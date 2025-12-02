import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCiudades } from '../../services/apiService';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es'; 
registerLocale('es', es); 

import './Buscador.css';

const Buscador = () => {
    const [ciudades, setCiudades] = useState([]);
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
    
    const [rangoFechas, setRangoFechas] = useState([null, null]);
    const [fechaInicio, fechaFin] = rangoFechas;

    const navigate = useNavigate();
    const haCargadoCiudades = useRef(false); 

    useEffect(() => {
        const cargarCiudades = async () => {
            const data = await getAllCiudades();
            setCiudades(data);
        };
        if (!haCargadoCiudades.current) {
            cargarCiudades();
            haCargadoCiudades.current = true; 
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!ciudadSeleccionada || !fechaInicio || !fechaFin) {
            alert("Por favor, selecciona una ciudad y un rango de fechas.");
            return;
        }

        const inicio = fechaInicio.toISOString().split('T')[0];
        const fin = fechaFin.toISOString().split('T')[0];

        navigate(`/search-results?ciudadId=${ciudadSeleccionada}&inicio=${inicio}&fin=${fin}`);
    };

    return (
        <div className="buscador-container">
            <h2>Busca ofertas en hoteles, casas y mucho más</h2>
            <form className="buscador-form" onSubmit={handleSubmit}>
                
                <div className="form-input">
                    <label htmlFor="ciudad-search">¿A dónde vamos?</label>
                    <select 
                        id="ciudad-search"
                        value={ciudadSeleccionada}
                        onChange={(e) => setCiudadSeleccionada(e.target.value)}
                        required
                    >
                        <option value="" disabled>Selecciona una ciudad</option>
                        {ciudades.map(ciudad => (
                            <option key={ciudad.id} value={ciudad.id}>
                                {ciudad.nombre}, {ciudad.pais}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-input form-input-datepicker">
                    <label>Check-in - Check-out</label>
                    <DatePicker
                        selectsRange={true}
                        startDate={fechaInicio}
                        endDate={fechaFin}
                        onChange={(update) => {
                            setRangoFechas(update);
                        }}
                        monthsShown={2} 
                        locale="es" 
                        minDate={new Date()} 
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Selecciona un rango"
                        className="datepicker-input" 
                        required
                    />
                </div>

                <button type="submit" className="buscador-button">
                    Buscar
                </button>
            </form>
        </div>
    );
};

export default Buscador;


