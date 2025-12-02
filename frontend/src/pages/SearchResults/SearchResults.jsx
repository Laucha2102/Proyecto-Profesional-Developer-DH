import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProductosDisponibles } from '../../services/apiService';
import '../Home/Home.css'; 

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const ciudadId = searchParams.get('ciudadId');
    const inicio = searchParams.get('inicio');
    const fin = searchParams.get('fin');

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!ciudadId || !inicio || !fin) {
            setError('Faltan parámetros de búsqueda.');
            setLoading(false);
            return;
        }

        const buscarProductos = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getProductosDisponibles(ciudadId, inicio, fin);
                setProductos(data);
            } catch (err) {
                setError('Error al cargar los productos disponibles.');
            }
            setLoading(false);
        };

        buscarProductos();
    }, [ciudadId, inicio, fin]); 


    if (loading) {
        return <div className="home-container"><p>Buscando productos disponibles...</p></div>;
    }

    if (error) {
        return <div className="home-container"><p>{error}</p></div>;
    }

    return (
        <div className="home-container">
            <h2>Resultados de tu búsqueda</h2>
            <p>Productos disponibles en la ciudad seleccionada entre {inicio} y {fin}.</p>

            <div className="home-recomendaciones">
                {productos.length > 0 ? (
                    <div className="producto-grid">
                        {productos.map((producto) => (
                            <div key={producto.id} className="producto-card-placeholder">
                                {producto.imagenes && producto.imagenes.length > 0 && (
                                    <img 
                                        src={producto.imagenes[0].urlImagen} 
                                        alt={producto.imagenes[0].titulo} 
                                        className="producto-card-img"
                                    />
                                )}
                                <div className="producto-card-info">
                                    <h3>{producto.nombre}</h3>
                                    <p>{producto.descripcion.substring(0, 100)}...</p>
                                    <Link to={`/producto/${producto.id}`} className="detalle-button">
                                        Ver detalle
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No se encontraron productos disponibles para esta ciudad y rango de fechas.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;