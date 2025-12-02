import React, { useState, useEffect } from 'react';
import { 
    crearProducto, 
    getAllProductos,
    deleteProducto, 
    getAllCategorias,
    getAllCiudades,
    getAllCaracteristicas,
    getAllPoliticas
} from '../../services/apiService'; 
import './CrearProducto.css'; 
import './ListaProductosAdmin.css'; 

const CrearProducto = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenes, setImagenes] = useState([{ titulo: '', urlImagen: '' }]);
    const [categorias, setCategorias] = useState([]); 
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(''); 
    const [ciudades, setCiudades] = useState([]); 
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState(''); 
    const [direccion, setDireccion] = useState('');
    const [precio, setPrecio] = useState('');
    const [caracteristicas, setCaracteristicas] = useState([]); 
    const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]); 
    const [politicas, setPoliticas] = useState([]);
    const [politicasSeleccionadas, setPoliticasSeleccionadas] = useState([]);

    const [productos, setProductos] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarProductos = async () => {
        try {
            const dataPaginada = await getAllProductos(0, 100);
            setProductos(dataPaginada.content); 
        } catch (err) {
            console.error("Error cargando productos:", err);
            setError("Error al cargar la lista de productos.");
        }
    };
    
    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            
            await Promise.all([
                cargarProductos(),
                getAllCategorias().then(setCategorias).catch(err => console.error("Error cargando categorías", err)),
                getAllCiudades().then(setCiudades).catch(err => console.error("Error cargando ciudades", err)),
                getAllCaracteristicas().then(setCaracteristicas).catch(err => console.error("Error cargando características", err)),
                getAllPoliticas().then(setPoliticas).catch(err => console.error("Error cargando políticas", err))
            ]);
            
            setLoading(false);
        };

        cargarDatos();
    }, []);

    const handleImagenChange = (index, event) => {
        const nuevosCampos = [...imagenes];
        nuevosCampos[index][event.target.name] = event.target.value;
        setImagenes(nuevosCampos);
    };

    const addImagenCampo = () => {
        setImagenes([...imagenes, { titulo: '', urlImagen: '' }]);
    };

    const removeImagenCampo = (index) => {
        const nuevosCampos = [...imagenes];
        nuevosCampos.splice(index, 1);
        setImagenes(nuevosCampos);
    };

    const handleCaracteristicaChange = (id) => {
        setCaracteristicasSeleccionadas(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handlePoliticaChange = (id) => {
        setPoliticasSeleccionadas(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const validarFormulario = () => {
        if (nombre.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
        if (descripcion.trim().length < 10) return "La descripción es muy corta.";
        if (!categoriaSeleccionada) return "Debes seleccionar una categoría.";
        if (!ciudadSeleccionada) return "Debes seleccionar una ciudad.";
        if (direccion.trim() === "") return "La dirección es obligatoria.";
        if (parseFloat(precio) <= 0) return "El precio debe ser mayor a 0.";
        
        // Validar que todas las imágenes tengan titulo y url
        const imagenesIncompletas = imagenes.some(img => !img.titulo.trim() || !img.urlImagen);
        if (imagenesIncompletas) return "Todas las imágenes deben tener título y archivo cargado.";
        
        return null; // Si devuelve null, es que todo está OK
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setExito('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No estás autenticado. Por favor inicia sesión.');
            return;
        }

        if (!categoriaSeleccionada || !ciudadSeleccionada) {
            setError('Categoría y Ciudad son obligatorias.');
            return;
        }

        const errorValidacion = validarFormulario();
        if (errorValidacion) {
            setError(errorValidacion);
            window.scrollTo(0, 0); 
            return;
        }



        const caracteristicasParaEnviar = caracteristicasSeleccionadas.map(id => ({ id: id }));
        const politicasParaEnviar = politicasSeleccionadas.map(id => ({ id: id }));

        const productoData = { 
            nombre, 
            descripcion, 
            categoria: { id: categoriaSeleccionada },
            ciudad: { id: ciudadSeleccionada },
            direccion,
            precio: parseFloat(precio),
            imagenes,
            caracteristicas: caracteristicasParaEnviar,
            politicas: politicasParaEnviar
        };

        try {
            await crearProducto(productoData);
            setExito('¡Producto creado exitosamente!');
            
            setNombre(''); 
            setDescripcion(''); 
            setCategoriaSeleccionada('');
            setCiudadSeleccionada(''); 
            setDireccion(''); 
            setPrecio(''); 
            setImagenes([{ titulo: '', urlImagen: '' }]);
            setCaracteristicasSeleccionadas([]); 
            setPoliticasSeleccionadas([]);
            
            await cargarProductos();
            
        } catch (err) {
            if (err.message.includes('403')) {
                setError('No tienes permisos de administrador para crear productos.');
            } else if (err.message.includes('401')) {
                setError('Sesión expirada. Por favor inicia sesión nuevamente.');
                localStorage.removeItem('token');
            } else {
                setError(err.message || 'Error al crear el producto. Intente nuevamente.');
            }
        }
    };

    const handleEliminar = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmar) {
            try {
                await deleteProducto(id);
                setExito('Producto eliminado exitosamente.');
                await cargarProductos();
            } catch (err) {
                setError(err.message || 'Error al eliminar el producto.');
            }
        }
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const base64 = await convertBase64(file);
                const nuevosCampos = [...imagenes];
                nuevosCampos[index]['urlImagen'] = base64; 
                setImagenes(nuevosCampos);
            } catch (error) {
                console.error("Error al convertir imagen", error);
            }
        }
    };

    return (
        <div className="crear-producto-container">
            <h2>Panel de Administración - Agregar Producto</h2>
            
            <form onSubmit={handleSubmit} className="crear-producto-form">
                
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del Producto</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea 
                        id="descripcion" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="categoria">Categoría</label>
                    <select 
                        id="categoria" 
                        value={categoriaSeleccionada} 
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Selecciona una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.titulo}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="ciudad">Ciudad</label>
                    <select 
                        id="ciudad" 
                        value={ciudadSeleccionada} 
                        onChange={(e) => setCiudadSeleccionada(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Selecciona una ciudad</option>
                        {ciudades.map((ciudad) => (
                            <option key={ciudad.id} value={ciudad.id}>
                                {ciudad.nombre}, {ciudad.pais}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="direccion">Dirección</label>
                    <input 
                        type="text" 
                        id="direccion" 
                        value={direccion} 
                        onChange={(e) => setDireccion(e.target.value)} 
                        placeholder="Ej: Av. Corrientes 1234" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="precio">Precio</label>
                    <input 
                        type="number" 
                        id="precio" 
                        value={precio} 
                        onChange={(e) => setPrecio(e.target.value)} 
                        placeholder="Ej: 99.99" 
                        required 
                    />
                </div>

                <h3>Características</h3>
                <div className="caracteristicas-grid">
                    {caracteristicas.map((car) => (
                        <div key={car.id} className="checkbox-item">
                            <input 
                                type="checkbox" 
                                id={`car-${car.id}`} 
                                value={car.id}
                                checked={caracteristicasSeleccionadas.includes(car.id)}
                                onChange={() => handleCaracteristicaChange(car.id)} 
                            />
                            <label htmlFor={`car-${car.id}`}>{car.nombre}</label>
                        </div>
                    ))}
                </div>

                {/* Políticas del Producto */}
                <h3>Políticas del Producto</h3>
                <div className="caracteristicas-grid">
                    {politicas.map((pol) => (
                        <div key={pol.id} className="checkbox-item">
                            <input 
                                type="checkbox" 
                                id={`pol-${pol.id}`}
                                value={pol.id}
                                checked={politicasSeleccionadas.includes(pol.id)}
                                onChange={() => handlePoliticaChange(pol.id)}
                            />
                            <label htmlFor={`pol-${pol.id}`}>
                                {pol.tipo}: {pol.titulo}
                            </label>
                        </div>
                    ))}
                </div>

<h3>Imágenes</h3>
{imagenes.map((imagen, index) => (
    <div key={index} className="imagen-group" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
        
        <input 
            type="text" 
            name="titulo" 
            placeholder="Título de la imagen (ej. Vista frontal)" 
            value={imagen.titulo} 
            onChange={(e) => handleImagenChange(index, e)} 
            required 
        />

        <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Subir imagen:</label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(index, e)} 
                required={!imagen.urlImagen} 
            />
        </div>

        {imagen.urlImagen && (
            <div style={{ marginTop: '10px' }}>
                <img src={imagen.urlImagen} alt="Previsualización" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
            </div>
        )}

        {imagenes.length > 1 && (
            <button 
                type="button" 
                onClick={() => removeImagenCampo(index)} 
                className="btn-remove"
                style={{ marginTop: '10px' }}
            >
                Eliminar imagen
            </button>
        )}
    </div>
))}

<button type="button" onClick={addImagenCampo} className="btn-add">Agregar otra imagen</button>
                
                <hr />
                <button type="submit" className="btn-submit">
                    Guardar Producto
                </button>
                
                {exito && <p className="msg-exito">{exito}</p>}
                {error && <p className="msg-error">{error}</p>}
            </form>

            <hr className="section-divider" />
            <h3>Lista de Productos Existentes</h3>
            
            {loading ? (
                <p>Cargando productos...</p>
            ) : (
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>
                                    <button 
                                        onClick={() => handleEliminar(producto.id)} 
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

export default CrearProducto;