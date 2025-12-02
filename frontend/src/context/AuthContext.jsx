import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getMisFavoritos, toggleFavorito as apiToggleFavorito } from '../services/apiService'; 

const getAuthFromStorage = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                return { token: null, user: null };
            }
            return {
                token: token,
                user: { email: decoded.sub, roles: decoded.roles || [] }
            };
        } catch (error) {
            localStorage.removeItem('token');
            return { token: null, user: null };
        }
    }
    return { token: null, user: null };
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [authToken, setAuthToken] = useState(() => getAuthFromStorage().token);
    const [usuario, setUsuario] = useState(() => getAuthFromStorage().user);
    
    const [favoritos, setFavoritos] = useState([]); 

    useEffect(() => {
        const cargarFavoritos = async (token) => {
            const productosFavoritos = await getMisFavoritos(token);
            const idsFavoritos = productosFavoritos.map(prod => prod.id);
            setFavoritos(idsFavoritos);
        };

        if (authToken) {
            cargarFavoritos(authToken);
        } else {
            setFavoritos([]);
        }
    }, [authToken]); 


    // Función de Login
    const login = (token) => {
        localStorage.setItem('token', token);
        const { user } = getAuthFromStorage();
        setUsuario(user);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUsuario(null);
        setAuthToken(null);
    };

    const esAdmin = () => {
        return usuario && usuario.roles.includes('ROLE_ADMIN');
    };

    const toggleFavorito = async (productoId) => {
        if (!authToken) {
            console.error("Necesitas estar logueado para marcar favoritos");
            return;
        }

        try {
            const productosFavoritosActualizados = await apiToggleFavorito(productoId, authToken);
            const idsFavoritos = productosFavoritosActualizados.map(prod => prod.id);
            setFavoritos(idsFavoritos);
        } catch (error) {
            console.error("Error al actualizar favoritos en el contexto:", error);
        }
    };

    const esFavorito = (productoId) => {
        return favoritos.includes(productoId);
    };
    const value = {
        authToken,
        usuario,
        login,
        logout,
        isAuthenticated: !!authToken,
        esAdmin: esAdmin,
        
        favoritos: favoritos,
        toggleFavorito: toggleFavorito,
        esFavorito: esFavorito
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
