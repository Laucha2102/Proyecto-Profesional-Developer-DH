import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductosPorCategoria } from '../../services/apiService';
import '../Home/Home.css'; 

const CategoriaResultados = () => {
    const { id } = useParams(); 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarProductosFiltrados = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getProductosPorCategoria(id);
                setProductos(data);
            } catch (err) {
                setError('Error al cargar los productos.');
            }
            setLoading(false);
        };

        cargarProductosFiltrados();
    }, [id]); 


    if (loading) {
        return <div className="home-container"><p>Cargando productos...</p></div>;
    }

    if (error) {
        return <div className="home-container"><p>{error}</p></div>;
    }

    return (
        <div className="home-container">
            <h2>Resultados</h2>

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
                    <p>No se encontraron productos para esta categoría.</p>
                )}
            </div>
        </div>
    );
};

export default CategoriaResultados;