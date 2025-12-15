import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useProducts } from '../../context/ProductsContext';
import { adminService } from '../../services/adminService';
import { productosService } from '../../services/productosService';
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
  const [productosBackend, setProductosBackend] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // Estado para modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; nombre: string } | null>(null);

  // Estado para modal de confirmación de logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Estado para edición de productos
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form para agregar/editar productos
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

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    loadUsers();
    loadPedidos();
  }, []);

  // Recargar datos cuando cambias de pestaña (opcional, para refrescar)
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadPedidos();
    }
  }, [activeTab]);

  // Cargar productos del backend
  useEffect(() => {
    if (activeTab === 'products') {
      loadProductos();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    // Evitar cargar si ya está cargando
    if (loadingUsers) return;
    
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
    // Evitar cargar si ya está cargando
    if (loadingPedidos) return;
    
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

  const loadProductos = async () => {
    setLoadingProductos(true);
    try {
      const response = await productosService.listarProductos();
      console.log('Respuesta de productos:', response);
      
      if (response.success && response.data) {
        const productosArray = Array.isArray(response.data) ? response.data : response.data.productos || [];
        setProductosBackend(productosArray);
        console.log('Productos cargados desde BD:', productosArray.length);
      } else if (Array.isArray(response)) {
        setProductosBackend(response);
      }
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      console.error('Detalles del error:', error.response?.data);
      
      // Si el backend falla, usar productos del contexto local como fallback
      console.warn('Usando productos del contexto local como fallback');
      setProductosBackend(products);
      
      setMessage('⚠️ No se pudieron cargar productos desde el servidor. El backend necesita implementar GET /productos');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoadingProductos(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, nuevoRol: 'USER' | 'ADMIN', userEmail?: string) => {
    // Proteger al superadmin
    if (userEmail === 'superadmin@pasteleria.cl') {
      setMessage('No se puede modificar el rol del superadministrador');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
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

  const handleDeleteClick = (product: { id: string; nombre: string }) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await productosService.eliminarProducto(productToDelete.id);
        setMessage('✅ Producto eliminado correctamente de la base de datos');
        
        // Recargar la lista de productos desde el backend
        loadProductos();
      } catch (error: any) {
        console.error('Error eliminando producto:', error);
        console.error('Respuesta del backend:', error.response?.data);
        
        // Si el backend falla, eliminar del contexto local como fallback
        deleteProduct(productToDelete.id);
        
        // Actualizar la lista local
        setProductosBackend(prev => prev.filter(p => p.id !== productToDelete.id));
        
        let errorMsg = 'Error al eliminar del servidor';
        if (error.response?.status === 500) {
          errorMsg = '⚠️ Error del servidor al eliminar. Eliminado localmente. El backend necesita revisar el endpoint DELETE /admin/productos/{id}';
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        }
        
        setMessage(errorMsg);
      }
      setTimeout(() => setMessage(''), 5000);
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product: any) => {
    setIsEditMode(true);
    setEditingProductId(product.id);
    setForm({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio,
      categoria: product.categoria || '',
      imagen: product.imagen || '',
      stock: product.stock || 0,
      esPersonalizable: product.esPersonalizable || false,
    });
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingProductId(null);
    setForm({ id: '', nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false });
  };

  const handleLogoutClick = () => {
    setIsLoggingOut(false); // Resetear el estado antes de abrir el modal
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Pequeño delay para que el usuario vea el loading
      await new Promise(resolve => setTimeout(resolve, 500));
      await logout();
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      console.error('Error en logout:', error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const precio = Number(form.precio);
    const stockVal = Number(form.stock) || 0;
    const idValRaw = (form.id || '').trim();
    const idVal = idValRaw.toUpperCase();
    const idRegex = /^[A-Za-z0-9]{4,6}$/;

    // Validaciones
    if (!isEditMode) {
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

    try {
      if (isEditMode && editingProductId) {
        // ACTUALIZAR producto existente
        const datosActualizacion = {
          nombre: form.nombre!,
          descripcion: form.descripcion || undefined,
          precio: precio,
          stock: stockVal,
          categoria: form.categoria || undefined,
          imagen: form.imagen || undefined,
          disponible: true,
        };
        
        console.log('📝 Actualizando producto:', editingProductId, datosActualizacion);
        
        await productosService.actualizarProducto(editingProductId, datosActualizacion);
        
        console.log('✅ Producto actualizado en BD');
        
        // Recargar la lista de productos
        loadProductos();
        
        setMessage(`✅ Producto actualizado exitosamente — ${form.nombre}`);
        setIsEditMode(false);
        setEditingProductId(null);
      } else {
        // CREAR nuevo producto
        const datosProducto = {
          id: idVal,
          nombre: form.nombre!,
          descripcion: form.descripcion || undefined,
          precio: precio,
          stock: stockVal,
          categoria: form.categoria || undefined,
          imagen: form.imagen || undefined,
          disponible: true,
        };
        
        console.log('📦 Intentando crear producto:', datosProducto);
        console.log('🔑 Token actual:', localStorage.getItem('authToken')?.substring(0, 20) + '...');
        
        // Crear producto en el backend con el formato correcto
        const nuevoProducto = await productosService.crearProducto(datosProducto);

        console.log('✅ Producto creado en BD:', nuevoProducto);

        // Recargar la lista de productos desde el backend
        loadProductos();

        setMessage(`✅ Producto agregado exitosamente — ID: ${idVal} · Precio: $${precio.toLocaleString('es-CL')} · Stock: ${stockVal}`);
      }
      
      setForm({ id: '', nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false });
      setTimeout(() => setMessage(''), 4000);
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      let errorMsg = 'Error al crear el producto';
      if (error.response?.data) {
        // Si el backend devuelve un mensaje específico
        errorMsg = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setMessage(`❌ Error: ${errorMsg}`);
      setTimeout(() => setMessage(''), 8000);
    }
  };

  const totalIngresos = pedidos.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f6f8fa', minHeight: '100vh' }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0" style={{ color: '#1f2937' }}>Dashboard Administrativo</h1>
          <div>
            <span className="me-3 text-muted">Sesión: {currentUser?.email}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleLogoutClick}>Cerrar sesión</button>
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
            {(loadingUsers || loadingPedidos) ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando datos...</span>
                </div>
                <p className="mt-3 text-muted">Cargando estadísticas del dashboard...</p>
              </div>
            ) : (
              <>
                <div className="col-md-3 mb-3">
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
                <div className="col-md-3 mb-3">
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
                <div className="col-md-3 mb-3">
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
                <div className="col-md-3 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Ingresos Totales</h5>
                      <p className="card-text display-6">${totalIngresos.toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
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
                      const isSuperAdmin = u.email === 'superadmin@pasteleria.cl';
                      const isProtected = isSystem || isSuperAdmin;
                      
                      return (
                        <tr key={u.id}>
                          <td>{u.email}</td>
                          <td>{u.nombre || '-'}</td>
                          <td>
                            <span className={`badge ${u.rol === 'ADMIN' || u.rol === 'SYSTEM' ? 'bg-success' : 'bg-secondary'}`}>
                              {u.rol}
                            </span>
                            {isSuperAdmin && (
                              <span className="badge bg-danger ms-1">PROTEGIDO</span>
                            )}
                          </td>
                          <td>
                            {!isProtected && (
                              <button
                                className={`btn btn-sm ${u.rol === 'ADMIN' ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => handleUpdateUserRole(u.id, u.rol === 'ADMIN' ? 'USER' : 'ADMIN', u.email)}
                              >
                                {u.rol === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                              </button>
                            )}
                            {isProtected && (
                              <span className="text-muted small">No modificable</span>
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
                            p.estado === 'EN_PROCESO' ? 'bg-info' :
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
                            <option value="EN_PROCESO">En Proceso</option>
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
            
            {/* Form para agregar/editar producto */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>{isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h5>
                {isEditMode && (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancelar Edición
                  </button>
                )}
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
                        disabled={isEditMode}
                      />
                      {isEditMode && <small className="text-muted">El ID no se puede modificar</small>}
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
                    {isEditMode ? 'Actualizar Producto' : 'Agregar Producto'}
                  </button>
                </form>
              </div>
            </div>

            {/* Lista de productos */}
            {loadingProductos ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status" style={{ color: '#5D4037' }}>
                  <span className="visually-hidden">Cargando productos...</span>
                </div>
              </div>
            ) : (
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
                    {productosBackend.length > 0 ? (
                      productosBackend.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.nombre}</td>
                          <td>{p.categoria || '-'}</td>
                          <td>${p.precio?.toLocaleString('es-CL') || 0}</td>
                          <td>{p.stock || 0}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditClick(p)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteClick({ id: p.id, nombre: p.nombre })}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
                          No hay productos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCancelDelete}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ backgroundColor: '#FFF5E1' }}>
              <div className="modal-header" style={{ borderBottom: '2px solid #FFC0CB' }}>
                <h5 className="modal-title" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                  Confirmar Eliminación
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCancelDelete}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar el producto?</p>
                {productToDelete && (
                  <p className="fw-bold" style={{ color: '#5D4037' }}>
                    {productToDelete.nombre}
                  </p>
                )}
                <p className="text-muted small">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer" style={{ borderTop: '2px solid #FFC0CB' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCancelDelete}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCancelLogout}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: '2px solid #FFC0CB' }}>
                <h5 className="modal-title" style={{ color: '#5D4037' }}>
                  Cerrar Sesión
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCancelLogout}
                  disabled={isLoggingOut}
                ></button>
              </div>
              <div className="modal-body">
                {isLoggingOut ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Cerrando sesión...</span>
                    </div>
                    <p className="text-muted">Cerrando sesión...</p>
                  </div>
                ) : (
                  <>
                    <p>¿Estás seguro de que deseas cerrar sesión?</p>
                    <p className="text-muted small">Deberás iniciar sesión nuevamente para acceder al dashboard.</p>
                  </>
                )}
              </div>
              {!isLoggingOut && (
                <div className="modal-footer" style={{ borderTop: '2px solid #FFC0CB' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCancelLogout}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={handleConfirmLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
