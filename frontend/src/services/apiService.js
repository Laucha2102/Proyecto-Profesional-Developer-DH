import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const crearProducto = async (productoData) => {
    try {
        const response = await api.post('/productos', productoData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el producto:", error.response?.data || error.message);

        let errorMsg = "Ocurrió un error desconocido al crear.";
        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                errorMsg = error.response.data;
            }
            else if (error.response.data.error) {
                errorMsg = `Error ${error.response.data.status}: ${error.response.data.error}`;
            }
        } else if (error.message) {
            errorMsg = error.message;
        }
        
        throw new Error(errorMsg);
    }
};

export const getAllProductos = async (page = 0, size = 10) => {
    try {
        const response = await api.get('/productos', {
            params: {
                page: page,
                size: size
            }
        });
        return response.data; 
    } catch (error) {
        console.error("Error al listar productos:", error);
        return { content: [], totalPages: 0 }; 
    }
};

export const deleteProducto = async (id) => {
    try {
        const response = await api.delete(`/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el producto:", error.response?.data || error.message);

        let errorMsg = "Ocurrió un error desconocido al eliminar.";
        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                errorMsg = error.response.data;
            }
            else if (error.response.data.error) {
                errorMsg = `Error ${error.response.data.status}: ${error.response.data.error}`;
            }
        } else if (error.message) {
            errorMsg = error.message;
        }

        throw new Error(errorMsg);
    }
};

export const getAllCategorias = async () => {
    try {
        const response = await api.get('/categorias');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorías:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al obtener las categorías');
    }
};

export const getAllCiudades = async () => {
    try {
        const response = await api.get('/ciudades');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las ciudades:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al obtener las ciudades');
    }
};

export const getAllCaracteristicas = async () => {
    try {
        const response = await api.get('/caracteristicas');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las características:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al obtener las características');
    }
};

export const getProductosAleatorios = async () => {
    try {
        const response = await api.get('/productos/random');
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos aleatorios:", error.response?.data || error.message);
        return [];
    }
};

export const getProductoById = async (id) => {
    try {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el producto:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al obtener el producto');
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Error en el registro:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al registrar el usuario');
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await api.post('/auth/login', loginData);
        return response.data;
    } catch (error) {
        console.error("Error en el login:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Email o contraseña incorrectos');
    }
};

export const crearCaracteristica = async (caracteristicaData) => {
    try {
        const response = await api.post('/caracteristicas', caracteristicaData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la característica:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al crear la característica');
    }
};

export const eliminarCaracteristica = async (id) => {
    try {
        const response = await api.delete(`/caracteristicas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la característica:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al eliminar la característica');
    }
};

export const crearCategoria = async (categoriaData) => {
    try {
        const response = await api.post('/categorias', categoriaData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la categoría:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al crear la categoría');
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const response = await api.delete(`/categorias/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la categoría:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al eliminar la categoría');
    }
};

export const getProductosPorCategoria = async (idCategoria) => {
    try {
        const response = await api.get(`/productos/categoria/${idCategoria}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos por categoría:", error.response?.data || error.message);
        return [];
    }
};

export const getReservasPorProducto = async (productoId) => {
    try {
        const response = await api.get(`/reservas/producto/${productoId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener reservas:", error.response?.data || error.message);
        return [];
    }
};

export const getProductosDisponibles = async (ciudadId, fechaInicio, fechaFin) => {
    try {
        const response = await api.get('/productos/disponibles', {
            params: {
                ciudadId: ciudadId,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar productos disponibles:", error.response?.data || error.message);
        return [];
    }
};

export const getAllPoliticas = async () => {
    try {
        const response = await api.get('/politicas');
        return response.data;
    } catch (error) {
        console.error("Error al obtener políticas:", error.response?.data || error.message);
        return [];
    }
};

export const toggleFavorito = async (productoId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/usuarios/favoritos/${productoId}`, 
            {}, // Cuerpo vacío
            {
                headers: { 'Authorization': `Bearer ${token}` } 
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error al cambiar favorito:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al cambiar favorito');
    }
};

export const getMisFavoritos = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/usuarios/favoritos`, 
            {
                headers: { 'Authorization': `Bearer ${token}` } 
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error al obtener favoritos:", error.response?.data || error.message);
        return [];
    }
};

export const getPuntuacionesPorProducto = async (productoId) => {
    try {
        const response = await axios.get(`${API_URL}/puntuaciones/producto/${productoId}`);
        return response.data; 
    } catch (error) {
        console.error("Error al obtener puntuaciones:", error.response?.data || error.message);
        return [];
    }
};

export const crearPuntuacion = async (puntuacionData, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/puntuaciones`, 
            puntuacionData,
            {
                headers: { 'Authorization': `Bearer ${token}` } 
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error al crear la puntuación:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al enviar la puntuación');
    }
};

export const crearReserva = async (reservaData, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/reservas`, 
            reservaData,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error al crear la reserva:", error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error al crear la reserva');
    }
};

export const getMisReservas = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/reservas/mis-reservas`, 
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error al obtener mis reservas:", error.response?.data || error.message);
        return [];
    }
};

export const actualizarProducto = async (productoData, token) => {
    try {
        const response = await axios.put(
            `${API_URL}/productos`, 
            productoData,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Error al actualizar el producto');
    }
};