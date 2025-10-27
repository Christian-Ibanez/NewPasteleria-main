import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
  const { user, logout, updateUser, addDeliveryAddress, changePassword } = useUser();
  const navigate = useNavigate();
  
  const [newAddress, setNewAddress] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [expandedPedido, setExpandedPedido] = useState<string | null>(null);

  // Si no hay usuario autenticado, redirigir al login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.trim()) {
      addDeliveryAddress(newAddress);
      setNewAddress('');
      setMessage('Dirección agregada correctamente');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (changePassword(oldPassword, newPassword)) {
      setOldPassword('');
      setNewPassword('');
      setMessage('Contraseña actualizada correctamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setError('La contraseña actual no es correcta');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <h3 className="card-title" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                Mi Perfil
              </h3>
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Teléfono:</strong> {user.telefono || 'No especificado'}</p>
              
              {/* Sección de beneficios y descuentos */}
              <div className="mt-4 mb-3">
                <h5 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Mis Beneficios</h5>
                {(user.descuentoEspecial ?? 0) > 0 && (
                  <div className="alert alert-success py-2 mb-2">
                    <i className="bi bi-tag-fill me-2"></i>
                    Descuento del {user.descuentoEspecial}% en todas tus compras
                  </div>
                )}
                {user.esDuoc && (
                  <div className="alert alert-info py-2 mb-2">
                    <i className="bi bi-gift-fill me-2"></i>
                    Torta gratis en tu cumpleaños
                  </div>
                )}
                {user.fechaNacimiento && (
                  <p className="small text-muted">
                    <i className="bi bi-calendar-event me-2"></i>
                    Cumpleaños: {new Date(user.fechaNacimiento).toLocaleDateString('es-CL', {
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                )}
                {user.codigoDescuento && (
                  <p className="small text-muted">
                    <i className="bi bi-ticket-perforated me-2"></i>
                    Código aplicado: {user.codigoDescuento}
                  </p>
                )}
              </div>

              <button 
                className="btn w-100 mt-3"
                onClick={handleLogout}
                style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card mb-4 shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <h4 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Direcciones de Entrega</h4>
              <ul className="list-group list-group-flush">
                {user.direccionesEntrega?.map((direccion, index) => (
                  <li key={index} className="list-group-item" style={{ backgroundColor: '#FFF5E1' }}>
                    {direccion}
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddAddress} className="mt-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nueva dirección"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="btn"
                    style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
                  >
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card mb-4 shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <h4 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Cambiar Contraseña</h4>
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña actual"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn"
                  style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
                >
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          </div>

          <div className="card shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
            <div className="card-body">
              <h4 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Historial de Pedidos</h4>
              {user.historialPedidos && user.historialPedidos.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {user.historialPedidos.map((pedido) => (
                    <div key={pedido.id}>
                      <div 
                        className="d-flex justify-content-between align-items-center p-3 rounded cursor-pointer" 
                        onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
                        style={{ 
                          backgroundColor: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <span style={{ fontFamily: 'Lato, sans-serif' }}>
                            {new Date(pedido.fechaPedido).toLocaleDateString('es-CL', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span 
                            className="px-2 py-1 rounded" 
                            style={{ 
                              backgroundColor: '#90EE90',
                              color: '#006400',
                              fontSize: '0.85rem'
                            }}
                          >
                            Pagado
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fw-bold">
                            ${pedido.total.toLocaleString('es-CL')} CLP
                          </span>
                          <i className={`bi bi-chevron-${expandedPedido === pedido.id ? 'up' : 'down'}`}></i>
                        </div>
                      </div>
                      
                      {expandedPedido === pedido.id && (
                        <div className="p-3 border-top" style={{ backgroundColor: 'white' }}>
                          {pedido.productos.map((producto) => (
                            <div 
                              key={producto.productoId} 
                              className="d-flex justify-content-between align-items-center py-2"
                            >
                              <span>{producto.nombre}</span>
                              <span className="text-muted">Cantidad: {producto.cantidad}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No hay pedidos realizados aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;