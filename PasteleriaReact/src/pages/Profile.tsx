import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { REGIONES_COMUNAS } from '../utils/validations';
import { pedidosService } from '../services/pedidosService';

const Profile: React.FC = () => {
  const { user, logout, addDeliveryAddress, changePassword, isAdmin, loading } = useUser();
  const navigate = useNavigate();
  
  const [regionInput, setRegionInput] = useState('');
  const [comunaInput, setComunaInput] = useState('');
  const [calleInput, setCalleInput] = useState('');
  const [numeroInput, setNumeroInput] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [expandedPedido, setExpandedPedido] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  // Si no hay usuario autenticado, redirigir al login
  // Pero esperar a que termine de cargar para no redirigir prematuramente
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Cargar pedidos del usuario
  useEffect(() => {
    const cargarPedidos = async () => {
      if (!user) return;
      
      setLoadingPedidos(true);
      try {
        const response = await pedidosService.listarPedidos(undefined, 1, 50);
        console.log('Respuesta completa de pedidos:', response);
        
        // La estructura esperada es: {success: true, data: {total, page, limit, pedidos: []}}
        let pedidosData = [];
        if (response?.data?.pedidos && Array.isArray(response.data.pedidos)) {
          pedidosData = response.data.pedidos;
        } else if (response?.pedidos && Array.isArray(response.pedidos)) {
          pedidosData = response.pedidos;
        } else if (Array.isArray(response?.data)) {
          pedidosData = response.data;
        } else if (Array.isArray(response)) {
          pedidosData = response;
        }
        
        console.log('Pedidos extraídos:', pedidosData);
        console.log('Cantidad de pedidos:', pedidosData.length);
        
        if (pedidosData.length === 0) {
          console.warn('No hay pedidos en la base de datos para este usuario');
        }
        
        setPedidos(pedidosData);
      } catch (err: any) {
        console.error('Error al cargar pedidos:', err);
        console.error('Status:', err.response?.status);
        console.error('Detalles del error:', err.response?.data);
        
        if (err.response?.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        } else {
          setError('No se pudieron cargar los pedidos');
        }
        setTimeout(() => setError(''), 4000);
      } finally {
        setLoadingPedidos(false);
      }
    };

    cargarPedidos();
  }, [user]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación simple
    if (!regionInput || !comunaInput || !calleInput || !numeroInput) {
      setError('Completa región, comuna, calle y número antes de agregar');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const address = `${calleInput} ${numeroInput}, ${comunaInput}, ${regionInput}`;
    addDeliveryAddress(address);
    // limpiar campos
    setRegionInput('');
    setComunaInput('');
    setCalleInput('');
    setNumeroInput('');
    setMessage('Dirección agregada correctamente');
    setTimeout(() => setMessage(''), 3000);
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

              {isAdmin() && (
                <button
                  className="btn w-100 mb-2"
                  onClick={() => navigate('/admin/dashboard')}
                  style={{ backgroundColor: '#8B4513', borderColor: '#8B4513', color: 'white' }}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Panel de Administración
                </button>
              )}

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
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">Región</label>
                    <select
                      className="form-select"
                      value={regionInput}
                      onChange={(e) => { setRegionInput(e.target.value); setComunaInput(''); }}
                    >
                      <option value="">Seleccione una región</option>
                      {Object.keys(REGIONES_COMUNAS).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Comuna</label>
                    <select
                      className="form-select"
                      value={comunaInput}
                      onChange={(e) => setComunaInput(e.target.value)}
                      disabled={!regionInput}
                    >
                      <option value="">Seleccione una comuna</option>
                      {regionInput && REGIONES_COMUNAS[regionInput]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-md-8">
                    <label className="form-label">Calle</label>
                    <input
                      className="form-control"
                      value={calleInput}
                      onChange={(e) => setCalleInput(e.target.value)}
                      placeholder="Ej: Av. Principal"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Número</label>
                    <input
                      className="form-control"
                      value={numeroInput}
                      onChange={(e) => setNumeroInput(e.target.value)}
                      placeholder="Ej: 123"
                    />
                  </div>
                </div>

                <div className="d-grid mt-3">
                  <button 
                    type="submit" 
                    className="btn"
                    style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
                  >
                    Agregar dirección
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
              
              {loadingPedidos ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status" style={{ color: '#5D4037' }}>
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : pedidos && pedidos.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {pedidos.map((pedido) => (
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
                            <div>
                              <div style={{ fontFamily: 'Lato, sans-serif' }}>
                                {new Date(pedido.fechaPedido).toLocaleDateString('es-CL', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                                {pedido.direccionEnvio && (
                                  <div className="small text-muted">Dirección: {pedido.direccionEnvio}</div>
                                )}
                                {/* Mostrar método de pago si existe */}
                                {pedido.metodoPago && (
                                  <div className="small text-muted">Pago: {pedido.metodoPago === 'efectivo' ? 'Efectivo' : `Tarjeta ****${pedido.tarjetaUltimos4 ?? '----'}`}</div>
                                )}
                            </div>
                          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
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
                            {/* Estado del pedido (coloreado) */}
                            {pedido.estado && (() => {
                              const estadoRaw = String(pedido.estado);
                              const label = (estadoRaw === 'pendiente' || estadoRaw.toLowerCase().includes('proceso') ) ? 'En proceso'
                                : (estadoRaw.toLowerCase().includes('preparacion') ? 'En preparación'
                                : (estadoRaw.toLowerCase().includes('en camino') || estadoRaw.toLowerCase().includes('enviado') ? 'En camino'
                                : (estadoRaw.toLowerCase().includes('entregado') ? 'Entregado' : estadoRaw)));
                              const colorMap: Record<string, { bg: string; fg: string }> = {
                                'En proceso': { bg: '#FFF4E5', fg: '#8A5800' },
                                'En preparación': { bg: '#FFF4E5', fg: '#8A5800' },
                                'En camino': { bg: '#E8F4FF', fg: '#0B5FFF' },
                                'Entregado': { bg: '#E6F4EA', fg: '#1B7A2F' },
                                'Cancelado': { bg: '#FDECEA', fg: '#B00020' }
                              };
                              const colors = colorMap[label] ?? { bg: '#F0F0F0', fg: '#333' };
                              return (
                                <span className="px-2 py-1 rounded" style={{ backgroundColor: colors.bg, color: colors.fg, fontSize: '0.85rem' }}>
                                  {label}
                                </span>
                              );
                            })()}
                          </div>
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
                          {pedido.productos && pedido.productos.map((producto: any) => (
                            <div 
                              key={producto.productoId || producto.id} 
                              className="d-flex justify-content-between align-items-center py-2"
                            >
                              <div>
                                <span>{producto.nombre}</span>
                                {producto.personalizacion && (
                                  <small className="d-block text-muted">
                                    <i className="bi bi-pencil-square me-1"></i>
                                    Mensaje: {producto.personalizacion}
                                  </small>
                                )}
                              </div>
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