import React, { useState, useEffect } from 'react';
import { 
    getAllCaracteristicas, 
    crearCaracteristica, 
    eliminarCaracteristica 
} from '../../services/apiService';
import '../Admin/CrearProducto.css'; 
import '../Admin/ListaProductosAdmin.css'; 

const AdminCaracteristicas = () => {
    const [nombre, setNombre] = useState('');
    const [icono, setIcono] = useState(''); 
    
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarCaracteristicas = async () => {
        setLoading(true);
        try {
            const data = await getAllCaracteristicas();
            setCaracteristicas(data);
        } catch (err) {
            console.error("Error cargando características:", err);
            setError("Error al cargar la lista.");
        }
        setLoading(false);
    };

    useEffect(() => {
        cargarCaracteristicas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        if (!nombre || !icono) {
            setError('Ambos campos son obligatorios.');
            return;
        }

        try {
            const caracteristicaData = { nombre, icono };
            await crearCaracteristica(caracteristicaData);
            setExito('¡Característica creada exitosamente!');
            
            setNombre('');
            setIcono('');
            
            await cargarCaracteristicas(); 
            
        } catch (err) {
            setError(err.message || 'Error al crear la característica.');
        }
    };

    const handleEliminar = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta característica?");
        
        if (confirmar) {
            try {
                await eliminarCaracteristica(id);
                setExito('Característica eliminada exitosamente.');
                await cargarCaracteristicas(); 
            } catch (err) {
                setError(err.message || 'Error al eliminar.');
            }
        }
    };

    return (
        <div className="crear-producto-container">
            <h2>Administrar Características</h2>
            
            <form onSubmit={handleSubmit} className="crear-producto-form">
                <h3>Añadir nueva característica</h3>
                
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Ej: WiFi"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="icono">Ícono (FontAwesome)</label>
                    <input 
                        type="text" 
                        id="icono" 
                        value={icono} 
                        onChange={(e) => setIcono(e.target.value)} 
                        placeholder="Ej: fa-solid fa-wifi"
                        required 
                    />
                </div>

                <button type="submit" className="btn-submit">Guardar Característica</button>
                
                {exito && <p className="msg-exito">{exito}</p>}
                {error && <p className="msg-error">{error}</p>}
            </form>

            <hr className="section-divider" />
            <h3>Lista de Características Existentes</h3>
            
            {loading ? (
                <p>Cargando lista...</p>
            ) : (
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Ícono (Clase)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {caracteristicas.map(car => (
                            <tr key={car.id}>
                                <td>{car.id}</td>
                                <td>{car.nombre}</td>
                                <td>{car.icono}</td>
                                <td>
                                    <button 
                                        onClick={() => handleEliminar(car.id)} 
                                        className="btn-eliminar"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminCaracteristicas;