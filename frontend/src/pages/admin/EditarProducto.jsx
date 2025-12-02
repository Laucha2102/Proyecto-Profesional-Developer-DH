import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getProductoById, actualizarProducto, 
    getAllCategorias, getAllCiudades, getAllCaracteristicas, getAllPoliticas 
} from '../../services/apiService'; 
import { useAuth } from '../../context/AuthContext';
import '../admin/CrearProducto.css'; 

const EditarProducto = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { authToken } = useAuth();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [direccion, setDireccion] = useState('');
    const [precio, setPrecio] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);
    const [politicasSeleccionadas, setPoliticasSeleccionadas] = useState([]);

    const [categorias, setCategorias] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [politicas, setPoliticas] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        const cargarTodo = async () => {
            try {
                const [prod, cats, cities, chars, pols] = await Promise.all([
                    getProductoById(id),
                    getAllCategorias(),
                    getAllCiudades(),
                    getAllCaracteristicas(),
                    getAllPoliticas()
                ]);

                setCategorias(cats); setCiudades(cities); 
                setCaracteristicas(chars); setPoliticas(pols);

                setNombre(prod.nombre);
                setDescripcion(prod.descripcion);
                setDireccion(prod.direccion);
                setPrecio(prod.precio);
                setCategoriaSeleccionada(prod.categoria.id);
                setCiudadSeleccionada(prod.ciudad.id);
                setImagenes(prod.imagenes); // Carga las imágenes existentes
                setCaracteristicasSeleccionadas(prod.caracteristicas.map(c => c.id));
                setPoliticasSeleccionadas(prod.politicas.map(p => p.id));

            } catch (err) {
                setError("Error al cargar el producto.");
            }
        };
        cargarTodo();
    }, [id]);

    const handleImagenChange = (index, e) => {
        const nuevos = [...imagenes];
        nuevos[index][e.target.name] = e.target.value;
        setImagenes(nuevos);
    };
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };
    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertBase64(file);
            const nuevos = [...imagenes];
            nuevos[index]['urlImagen'] = base64;
            setImagenes(nuevos);
        }
    };
    const addImagenCampo = () => setImagenes([...imagenes, { titulo: '', urlImagen: '' }]);
    const removeImagenCampo = (index) => {
        const nuevos = [...imagenes];
        nuevos.splice(index, 1);
        setImagenes(nuevos);
    };
    const handleCaracteristicaChange = (id) => {
        setCaracteristicasSeleccionadas(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const handlePoliticaChange = (id) => {
        setPoliticasSeleccionadas(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const productoData = {
            id: id, 
            nombre, descripcion, direccion, precio: parseFloat(precio),
            categoria: { id: categoriaSeleccionada },
            ciudad: { id: ciudadSeleccionada },
            imagenes,
            caracteristicas: caracteristicasSeleccionadas.map(id => ({ id })),
            politicas: politicasSeleccionadas.map(id => ({ id }))
        };

        try {
            await actualizarProducto(productoData, authToken);
            alert("Producto actualizado correctamente");
            navigate('/administracion'); 
        } catch (err) {
            setError("Error al actualizar: " + err.message);
        }
    };

    return (
        <div className="crear-producto-container">
            <h2>Editar Producto: {nombre}</h2>
            <form onSubmit={handleSubmit} className="crear-producto-form">
                <div className="form-group"><label>Nombre</label><input value={nombre} onChange={e=>setNombre(e.target.value)} /></div>
                <div className="form-group"><label>Descripción</label><textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} /></div>
                <div className="form-group"><label>Precio</label><input type="number" value={precio} onChange={e=>setPrecio(e.target.value)} /></div>
                
                <h3>Imágenes</h3>
                {imagenes.map((imagen, index) => (
                    <div key={index} className="imagen-group" style={{border:'1px solid #ccc', padding:10, margin:10}}>
                        <input type="text" name="titulo" value={imagen.titulo} onChange={(e) => handleImagenChange(index, e)} placeholder="Título" />
                        {imagen.urlImagen && <img src={imagen.urlImagen} width="100" style={{display:'block', margin:'10px 0'}} />}
                        <input type="file" onChange={(e) => handleFileChange(index, e)} />
                        <button type="button" onClick={() => removeImagenCampo(index)}>Eliminar</button>
                    </div>
                ))}
                <button type="button" onClick={addImagenCampo}>Agregar Imagen</button>

                <button type="submit" className="btn-submit">Guardar Cambios</button>
                {error && <p className="msg-error">{error}</p>}
            </form>
        </div>
    );
};

export default EditarProducto;