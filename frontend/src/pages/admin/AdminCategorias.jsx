import React, { useState, useEffect } from 'react';
import { 
    getAllCategorias, 
    crearCategoria, 
    eliminarCategoria 
} from '../../services/apiService';
import './CrearProducto.css'; 
import './ListaProductosAdmin.css'; 

const AdminCategorias = () => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [urlImagen, setUrlImagen] = useState('');
    
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarCategorias = async () => {
        setLoading(true);
        try {
            const data = await getAllCategorias();
            setCategorias(data);
        } catch (err) {
            console.error("Error cargando categorías:", err);
            setError("Error al cargar la lista.");
        }
        setLoading(false);
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        if (!titulo || !descripcion || !urlImagen) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            const categoriaData = { titulo, descripcion, urlImagen };
            await crearCategoria(categoriaData);
            setExito('¡Categoría creada exitosamente!');
            
            setTitulo('');
            setDescripcion('');
            setUrlImagen('');
            
            await cargarCategorias();
            
        } catch (err) {
            setError(err.message || 'Error al crear la categoría.');
        }
    };

    const handleEliminar = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta categoría? (Esto podría afectar a productos existentes)");
        
        if (confirmar) {
            try {
                await eliminarCategoria(id);
                setExito('Categoría eliminada exitosamente.');
                await cargarCategorias();
            } catch (err) {
                setError(err.message || 'Error al eliminar.');
            }
        }
    };

    return (
        <div className="crear-producto-container">
            <h2>Administrar Categorías</h2>
            
            <form onSubmit={handleSubmit} className="crear-producto-form">
                <h3>Añadir nueva categoría</h3>
                
                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input 
                        type="text" 
                        id="titulo" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        placeholder="Ej: Cabañas"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea 
                        id="descripcion" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                        placeholder="Ej: Cabañas rústicas en la montaña"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="urlImagen">URL de la Imagen</label>
                    <input 
                        type="text" 
                        id="urlImagen" 
                        value={urlImagen} 
                        onChange={(e) => setUrlImagen(e.target.value)} 
                        placeholder="Ej: https://imagen.com/foto.jpg"
                        required 
                    />
                </div>

                <button type="submit" className="btn-submit">Guardar Categoría</button>
                
                {exito && <p className="msg-exito">{exito}</p>}
                {error && <p className="msg-error">{error}</p>}
            </form>

            <hr className="section-divider" />
            <h3>Lista de Categorías Existentes</h3>
            
            {loading ? (
                <p>Cargando lista...</p>
            ) : (
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map(cat => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td>{cat.titulo}</td>
                                <td>
                                    <button 
                                        onClick={() => handleEliminar(cat.id)} 
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

export default AdminCategorias;