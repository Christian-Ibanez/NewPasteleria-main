import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirigir según rol
        navigate('/profile');
      } else {
        setError(result.message || 'Email o contraseña incorrectos');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor, intente nuevamente.');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <h2 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                Iniciar Sesión
              </h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn w-100 mb-3"
                  style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: 'black' }}
                >
                  Iniciar Sesión
                </button>

                <div className="text-center mb-3">
                  <small className="text-muted">
                    Para acceder como administrador, use un correo terminado en @admin.cl
                  </small>
                </div>
                
                <div className="text-center">
                  <p>
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" style={{ color: '#5D4037' }}>
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;