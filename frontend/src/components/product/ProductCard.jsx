import React from 'react';
import { Link } from 'react-router-dom'; 
import './ProductCard.css';

const ProductCard = ({ producto }) => {
    
    const imagenPortada = producto.imagenes && producto.imagenes.length > 0 
        ? producto.imagenes[0].urlImagen 
        : 'https://via.placeholder.com/300'; 

    return (
        <article className="product-card">
            <img src={imagenPortada} alt={producto.nombre} className="product-card-img" />
            <div className="product-card-info">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion.substring(0, 100)}...</p> 
                
                <Link to={`/producto/${producto.id}`} className="btn-ver-mas">
                    Ver más
                </Link>
            </div>
        </article>
    );
};

export default ProductCard;