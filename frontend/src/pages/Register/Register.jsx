import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/apiService';
import './Register.css';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        if (!nombre || !apellido || !email || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const userData = { nombre, apellido, email, password };
            await registerUser(userData);
            
            setExito('¡Registro exitoso! Redirigiendo al inicio de sesión...');
            
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Crear cuenta</h2>
                
                <div className="auth-form-grid">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido</label>
                        <input type="text" id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>

                {error && <p className="msg-error">{error}</p>}
                {exito && <p className="msg-exito">{exito}</p>}

                <button type="submit" className="auth-button">Crear cuenta</button>

                <p className="auth-redirect">
                    ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;