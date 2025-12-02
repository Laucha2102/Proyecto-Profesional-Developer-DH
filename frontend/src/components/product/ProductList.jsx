import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css'; 

const ProductList = ({ productos }) => {
    return (
        <div className="product-list-grid">
            {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    );
};

export default ProductList;