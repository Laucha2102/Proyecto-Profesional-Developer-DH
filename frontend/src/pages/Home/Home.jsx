import React, { useState, useEffect } from 'react';
import { getAllProductos, getAllCategorias } from '../../services/apiService'; 
import { Link } from 'react-router-dom';
import Buscador from '../../components/Buscador/Buscador';
import './Home.css';

import HotelesImg from '../../assets/Hoteles.jpg'; 
import DepartamentosImg from '../../assets/Departamentos.jpg'; 
import CasasImg from '../../assets/Casas.jpg'; 
import HostelsImg from '../../assets/Hostels.jpg';



const categoryImageMap = {
    "Hoteles": HotelesImg,
    "Departamentos": DepartamentosImg,
    "Casa": CasasImg,
    "Hostels": HostelsImg,
    "default": HotelesImg 
};

const Home = () => {

    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [paginaActual, setPaginaActual] = useState(0); 
    const [totalPaginas, setTotalPaginas] = useState(0);

    const [categorias, setCategorias] = useState([]);
    const [loadingCategorias, setLoadingCategorias] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            if (categorias.length === 0) {
                setLoadingCategorias(true);
                const dataCategorias = await getAllCategorias();
                setCategorias(dataCategorias);
                setLoadingCategorias(false);
            }
            setLoadingProductos(true);
            const dataPaginada = await getAllProductos(paginaActual, 10); 
            setProductos(dataPaginada.content); 
            setTotalPaginas(dataPaginada.totalPages); 
            setLoadingProductos(false);
        };
        cargarDatos();
    }, [paginaActual]); 

    const irPaginaSiguiente = () => {
        setPaginaActual(prev => Math.min(prev + 1, totalPaginas - 1));
    };
    const irPaginaAnterior = () => {
        setPaginaActual(prev => Math.max(prev - 1, 0));
    };

    return (
        <div className="home-container">
         <Buscador />

            <div className="home-categorias">
                <h2>Buscar por tipo de alojamiento</h2>
                {loadingCategorias ? (
                    <p>Cargando categorías...</p>
                ) : (
                    <div className="categorias-grid">
                        {categorias.map((cat) => {
                            const imageUrl = categoryImageMap[cat.titulo] || categoryImageMap.default;

                            return (
                                <Link to={`/categoria/${cat.id}`} key={cat.id} className="categoria-link-wrapper">
                                    <div className="categoria-card">
                                        <img src={imageUrl} alt={cat.titulo} className="categoria-card-img" />
                                        <div className="categoria-card-info">
                                            <h3>{cat.titulo}</h3>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="home-recomendaciones">
                <h2>Recomendaciones</h2>
                
                {loadingProductos ? (
                    <p>Cargando productos...</p>
                ) : (
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
                )}

                <div className="paginacion-controles">
                    <button onClick={irPaginaAnterior} disabled={paginaActual === 0}>
                        Anterior
                    </button>
                    <span>Página {paginaActual + 1} de {totalPaginas}</span>
                    <button onClick={irPaginaSiguiente} disabled={paginaActual + 1 >= totalPaginas}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;






