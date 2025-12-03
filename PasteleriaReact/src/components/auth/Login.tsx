import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return; // Evitar múltiples envíos
    
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      console.log('Resultado del login:', result);
      
      if (result.success) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        // Esperar un momento para que el usuario vea el mensaje
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      } else {
        // El backend ya devolvió un mensaje de error
        const errorMsg = result.message || 'Email o contraseña incorrectos';
        console.log('Mostrando error:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Error capturado en handleSubmit:', err);
      // Mejorar los mensajes de error según el tipo de error
      let errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (err.response?.status === 404) {
        errorMessage = 'No existe una cuenta con este email';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
    
    return false; // Asegurar que no se recarga la página
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
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit} noValidate autoComplete="off">
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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