import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useProducts } from '../../context/ProductsContext';
import { adminService } from '../../services/adminService';
import type { Usuario, Pedido } from '../../types';

const Dashboard: React.FC = () => {
  const { currentUser, logout, isAdmin } = useUser();
  const { products, addProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview'|'users'|'orders'|'products'>('overview');
  
  // Estados para datos del backend
  const [users, setUsers] = useState<Usuario[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  // Form para agregar productos
  const [form, setForm] = useState<{ 
    id: string; 
    nombre: string; 
    descripcion: string; 
    precio: number; 
    categoria: string; 
    imagen: string; 
    stock: number; 
    esPersonalizable: boolean 
  }>({
    id: '', nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false
  });

  // Si no es admin, mostramos un mensaje claro
  if (!isAdmin()) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Acceso restringido. Debes iniciar sesión con una cuenta de administrador.
        </div>
        <Link to="/login" className="btn btn-primary">Ir al login</Link>
      </div>
    );
  }

  // Cargar usuarios del backend
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  // Cargar pedidos del backend
  useEffect(() => {
    if (activeTab === 'orders' && pedidos.length === 0) {
      loadPedidos();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await adminService.listarUsuarios(1, 100);
      if (response.success && response.data) {
        // response.data puede ser un array o un objeto con propiedad usuarios
        const usuariosArray = Array.isArray(response.data) ? response.data : response.data.usuarios || [];
        setUsers(usuariosArray);
        console.log('Usuarios cargados:', usuariosArray.length);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setMessage('Error al cargar usuarios');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const response = await adminService.listarPedidos(undefined, 1, 100);
      if (response.success && response.data) {
        // response.data puede ser un array o un objeto con propiedad pedidos
        const pedidosArray = Array.isArray(response.data) ? response.data : response.data.pedidos || [];
        setPedidos(pedidosArray);
        console.log('Pedidos cargados:', pedidosArray.length);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      setMessage('Error al cargar pedidos');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, nuevoRol: 'USER' | 'ADMIN') => {
    try {
      const response = await adminService.actualizarUsuario(userId, { rol: nuevoRol });
      if (response.success) {
        setMessage('Rol actualizado correctamente');
        loadUsers(); // Recargar lista
      } else {
        setMessage(response.message || 'Error al actualizar rol');
      }
    } catch (error) {
      setMessage('Error al actualizar rol');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateOrderStatus = async (pedidoId: string, nuevoEstado: string) => {
    try {
      const response = await adminService.actualizarEstadoPedido(pedidoId, nuevoEstado);
      if (response.success) {
        setMessage('Estado actualizado correctamente');
        loadPedidos(); // Recargar lista
      } else {
        setMessage(response.message || 'Error al actualizar estado');
      }
    } catch (error) {
      setMessage('Error al actualizar estado');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const precio = Number(form.precio);
    const stockVal = Number(form.stock) || 0;
    const idValRaw = (form.id || '').trim();
    const idVal = idValRaw.toUpperCase();
    const idRegex = /^[A-Za-z0-9]{4,6}$/;

    if (!idVal) {
      setMessage('Ingrese una ID de producto (4–6 caracteres alfanuméricos).');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!idRegex.test(idVal)) {
      setMessage('ID inválida. Debe tener entre 4 y 6 caracteres (letras y/o números).');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!form.nombre || !form.descripcion || !form.categoria) {
      setMessage('Completa nombre, descripción y categoría');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      setMessage('El precio debe ser mayor a 0');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addProduct({
      id: idVal,
      nombre: form.nombre!,
      descripcion: form.descripcion!,
      categoria: form.categoria!,
      precio: precio,
      imagen: form.imagen,
      stock: stockVal,
      esPersonalizable: !!form.esPersonalizable,
    });
    setForm({ id: '', nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false });
    setMessage(`Producto agregado — ID: ${idVal} · Precio: $${precio.toLocaleString('es-CL')} · Stock: ${stockVal}`);
    setTimeout(() => setMessage(''), 4000);
  };

  const totalIngresos = pedidos.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f6f8fa', minHeight: '100vh' }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0" style={{ color: '#1f2937' }}>Dashboard Administrativo</h1>
          <div>
            <span className="me-3 text-muted">Sesión: {currentUser?.email}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>

        {message && (
          <div className="alert alert-info mb-3">
            {message}
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Resumen
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Usuarios
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Pedidos
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Productos
            </button>
          </li>
        </ul>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Usuarios</h5>
                  <p className="card-text display-6">{users.length}</p>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('users')}>
                    Ver usuarios
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Pedidos</h5>
                  <p className="card-text display-6">{pedidos.length}</p>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('orders')}>
                    Ver pedidos
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Productos</h5>
                  <p className="card-text display-6">{products.length}</p>
                  <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('products')}>
                    Ver productos
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Ingresos Totales</h5>
                  <p className="card-text display-6">${totalIngresos.toLocaleString('es-CL')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <h4 className="mb-3">Gestión de Usuarios</h4>
            {loadingUsers ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSystem = u.rol === 'SYSTEM';
                      return (
                        <tr key={u.id}>
                          <td>{u.email}</td>
                          <td>{u.nombre || '-'}</td>
                          <td>
                            <span className={`badge ${u.rol === 'ADMIN' || u.rol === 'SYSTEM' ? 'bg-success' : 'bg-secondary'}`}>
                              {u.rol}
                            </span>
                          </td>
                          <td>
                            {!isSystem && (
                              <button
                                className={`btn btn-sm ${u.rol === 'ADMIN' ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => handleUpdateUserRole(u.id, u.rol === 'ADMIN' ? 'USER' : 'ADMIN')}
                              >
                                {u.rol === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            <h4 className="mb-3">Gestión de Pedidos</h4>
            {loadingPedidos ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.usuarioEmail || '-'}</td>
                        <td>{p.fechaPedido ? new Date(p.fechaPedido).toLocaleDateString('es-CL') : '-'}</td>
                        <td>${p.total.toLocaleString('es-CL')}</td>
                        <td>
                          <span className={`badge ${
                            p.estado === 'ENTREGADO' ? 'bg-success' : 
                            p.estado === 'CANCELADO' ? 'bg-danger' : 
                            'bg-warning'
                          }`}>
                            {p.estado}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="form-select form-select-sm"
                            value={p.estado}
                            onChange={(e) => handleUpdateOrderStatus(p.id, e.target.value)}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PREPARACION">En Preparación</option>
                            <option value="ENVIADO">Enviado</option>
                            <option value="ENTREGADO">Entregado</option>
                            <option value="CANCELADO">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <h4 className="mb-3">Gestión de Productos</h4>
            
            {/* Form para agregar producto */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Agregar Nuevo Producto</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddProduct}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ID (4-6 caracteres)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.id}
                        onChange={(e) => setForm({ ...form, id: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Precio</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.precio}
                        onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Categoría</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.categoria}
                        onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">URL Imagen</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.imagen}
                        onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={form.esPersonalizable}
                          onChange={(e) => setForm({ ...form, esPersonalizable: e.target.checked })}
                        />
                        <label className="form-check-label">Es Personalizable</label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Agregar Producto
                  </button>
                </form>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>${p.precio.toLocaleString('es-CL')}</td>
                      <td>{p.stock || 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (confirm(`¿Eliminar ${p.nombre}?`)) {
                              deleteProduct(p.id);
                              setMessage('Producto eliminado');
                              setTimeout(() => setMessage(''), 3000);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
