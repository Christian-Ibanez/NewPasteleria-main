import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const SimpleDashboard: React.FC = () => {
  const { currentUser, logout, isAdmin } = useUser();
  const navigate = useNavigate();

  if (!isAdmin()) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Acceso restringido. Debes ser administrador para ver esta página.
        </div>
        <button onClick={() => navigate('/profile')} className="btn btn-primary">
          Volver al Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
            Panel de Administración
          </h2>
          <p className="text-muted">
            Bienvenido, {currentUser?.nombre} ({currentUser?.email})
          </p>
        </div>
        <div className="col-auto">
          <button 
            onClick={() => navigate('/profile')} 
            className="btn btn-outline-secondary me-2"
          >
            <i className="bi bi-person-circle me-2"></i>
            Mi Perfil
          </button>
          <button 
            onClick={async () => { await logout(); navigate('/'); }} 
            className="btn btn-outline-danger"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Card de Productos */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body text-center">
              <i className="bi bi-box-seam display-4" style={{ color: '#8B4513' }}></i>
              <h5 className="card-title mt-3">Productos</h5>
              <p className="text-muted">Gestionar catálogo</p>
              <button className="btn btn-sm" style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB' }}>
                Próximamente
              </button>
            </div>
          </div>
        </div>

        {/* Card de Pedidos */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body text-center">
              <i className="bi bi-cart-check display-4" style={{ color: '#8B4513' }}></i>
              <h5 className="card-title mt-3">Pedidos</h5>
              <p className="text-muted">Ver historial</p>
              <button className="btn btn-sm" style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB' }}>
                Próximamente
              </button>
            </div>
          </div>
        </div>

        {/* Card de Usuarios */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body text-center">
              <i className="bi bi-people display-4" style={{ color: '#8B4513' }}></i>
              <h5 className="card-title mt-3">Usuarios</h5>
              <p className="text-muted">Gestionar clientes</p>
              <button className="btn btn-sm" style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB' }}>
                Próximamente
              </button>
            </div>
          </div>
        </div>

        {/* Card de Reportes */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body text-center">
              <i className="bi bi-graph-up display-4" style={{ color: '#8B4513' }}></i>
              <h5 className="card-title mt-3">Reportes</h5>
              <p className="text-muted">Estadísticas</p>
              <button className="btn btn-sm" style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB' }}>
                Próximamente
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Estado del Sistema
              </h5>
              <div className="alert alert-success mb-0">
                <strong>✓ Backend conectado</strong> - El sistema está funcionando correctamente.
              </div>
              <div className="mt-3">
                <p className="mb-1"><strong>Usuario:</strong> {currentUser?.nombre}</p>
                <p className="mb-1"><strong>Email:</strong> {currentUser?.email}</p>
                <p className="mb-0"><strong>Rol:</strong> <span className="badge bg-success">{currentUser?.rol}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
