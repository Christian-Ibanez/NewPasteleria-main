import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const NavBar: React.FC = () => {
  const { itemsCount } = useCart();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    navigate('/profile');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#FFF5E1' }}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
          Pastelería Mil Sabores
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/catalogo" 
                style={{ color: '#5D4037' }}
              >
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/nuestra-historia" 
                style={{ color: '#5D4037' }}
              >
                Nuestra Historia
              </Link>
            </li>
            {/** Link a Promociones eliminado por solicitud del usuario */}
          </ul>
          
          <div className="d-flex align-items-center">
            <button 
              onClick={() => navigate('/cart')}
              className="btn me-2 position-relative"
              style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
            >
              🛒 Carrito
              {itemsCount > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ backgroundColor: '#8B4513', color: 'white' }}
                >
                  {itemsCount}
                  <span className="visually-hidden">items en el carrito</span>
                </span>
              )}
            </button>

            <button
              onClick={handleProfileClick}
              className="btn me-2"
              style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
            >
              <i className="bi bi-person-circle me-1"></i>
              Mi Perfil
            </button>

            {user ? (
              <button 
                className="btn"
                onClick={handleLogout}
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn me-2"
                  style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn"
                  style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de inicio de sesión requerido */}
      {showLoginModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#FFF5E1',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div className="text-center">
              <i className="bi bi-person-x-fill text-danger" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3">¡Ups! Necesitas iniciar sesión</h4>
              <p className="mb-4">Para acceder a tu perfil, primero debes iniciar sesión en tu cuenta.</p>
              <div className="d-grid gap-2">
                <button
                  className="btn"
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/login');
                  }}
                  style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
                >
                  Iniciar Sesión
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/register');
                  }}
                  style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
                >
                  Registrarse
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;