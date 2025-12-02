import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import '../Register/Register.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            const loginData = { email, password };
            const response = await loginUser(loginData);
            
            login(response.token); 
            
            navigate('/');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>
                
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {error && <p className="msg-error">{error}</p>}

                <button type="submit" className="auth-button">Iniciar sesión</button>

                <p className="auth-redirect">
                    ¿Aún no tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;