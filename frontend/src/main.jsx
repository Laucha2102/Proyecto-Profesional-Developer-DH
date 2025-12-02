import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

import App from './App';
import Home from './pages/Home/Home';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CategoriaResultados from './pages/CategoriaResultados/CategoriaResultados';
import SearchResults from './pages/SearchResults/SearchResults';
import Reserva from './pages/Reserva/Reserva';
import MisReservas from './pages/MisReservas/MisReservas'; 

import CrearProducto from './pages/admin/CrearProducto';
import AdminCaracteristicas from './pages/admin/AdminCaracteristicas';
import AdminCategorias from './pages/admin/AdminCategorias';
import EditarProducto from './pages/admin/EditarProducto';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import "./index.css"; 

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        
                        <Route index element={<Home />} /> 
                        <Route path="producto/:id" element={<ProductoDetalle />} />
                        <Route path="register" element={<Register />} />
                        <Route path="login" element={<Login />} />
                        <Route path="categoria/:id" element={<CategoriaResultados />} />
                        <Route path="search-results" element={<SearchResults />} />

                            <Route path="producto/:productoId/reserva" element={<Reserva />} />
                            <Route path="mis-reservas" element={<MisReservas />} />

                        <Route element={<ProtectedRoute />}>
                        <Route path="administracion/productos/editar/:id" element={<EditarProducto />} />
                        <Route path="administracion" element={<CrearProducto />} />
                        <Route path="administracion/caracteristicas" element={<AdminCaracteristicas />} />
                        <Route path="administracion/categorias" element={<AdminCategorias />} />
                        </Route>
                    
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);