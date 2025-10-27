import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useProducts } from '../../context/ProductsContext';
import type { Producto } from '../../data/productos';

const Dashboard: React.FC = () => {
  const { currentUser, users, deleteUser, logout, isAdmin, adminUpdateUser } = useUser();
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview'|'users'|'orders'|'products'>('overview');
  const [confirm, setConfirm] = useState<{
    type: 'user-delete' | 'role-toggle' | 'product-delete';
    email?: string;
    targetRole?: 'user' | 'admin';
    productId?: string;
    message: string;
  } | null>(null);

  // Form state for products
  const [form, setForm] = useState<Partial<Producto>>({
    nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false,
  });

  // Si no es admin, mostramos un mensaje claro en lugar de navegar silenciosamente
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

  const handleDelete = (email: string) => {
    const res = deleteUser(email);
    setMessage(res.message ?? (res.success ? 'Usuario eliminado' : 'No se pudo eliminar'));
    setTimeout(() => setMessage(''), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Derived metrics
  const totalPedidos = useMemo(() => users.reduce((acc, u) => acc + (u.historialPedidos?.length || 0), 0), [users]);
  const totalIngresos = useMemo(() => users.reduce((acc, u) => acc + (u.historialPedidos?.reduce((s: number, p: any) => s + (p.total || 0), 0) || 0), 0), [users]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.descripcion || !form.categoria) {
      setMessage('Completa nombre, descripción y categoría');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addProduct({
      nombre: form.nombre!, descripcion: form.descripcion!, categoria: form.categoria!, precio: Number(form.precio) || 0,
      imagen: form.imagen, stock: Number(form.stock) || 0, esPersonalizable: !!form.esPersonalizable,
    });
    setForm({ nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false });
    setMessage('Producto agregado');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f6f8fa', minHeight: '100vh' }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0" style={{ color: '#1f2937' }}>Dashboard</h1>
          <div>
            <span className="me-3 text-muted">Sesión: {currentUser?.email}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        {/* KPI cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted">Usuarios</div>
                <div className="h4 mb-0">{users.length}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted">Pedidos</div>
                <div className="h4 mb-0">{totalPedidos}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-muted">Ingresos</div>
                <div className="h4 mb-0">${totalIngresos.toLocaleString('es-CL')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills mb-3" role="tablist">
          <li className="nav-item"><button className={`nav-link ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>Resumen</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='users'?'active':''}`} onClick={()=>setActiveTab('users')}>Usuarios</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}>Pedidos</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='products'?'active':''}`} onClick={()=>setActiveTab('products')}>Productos</button></li>
        </ul>

        {activeTab === 'users' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Gestión de usuarios</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Email</th><th>Rol</th><th>Pedidos</th><th>Inmutable</th><th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const isSystem = u.email.toLowerCase() === 'system@admin.cl' || u.immutable || u.role === 'system';
                      const count = u.historialPedidos?.length || 0;
                      return (
                        <tr key={u.email}>
                          <td>{u.email}</td>
                          <td><span className={`badge ${u.role==='admin' || u.role==='system' ? 'bg-success' : 'bg-secondary'}`}>{u.role}</span></td>
                          <td>{count}</td>
                          <td>{isSystem ? 'Sí' : 'No'}</td>
                          <td className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setConfirm({ type: 'user-delete', email: u.email, message: `¿Eliminar al usuario ${u.email}?` })}
                              disabled={isSystem}
                              title={isSystem ? 'Este usuario no puede eliminarse' : `Eliminar ${u.email}`}
                            >Eliminar</button>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              disabled={isSystem}
                              onClick={() => {
                                const nuevoRol = (u.role === 'admin' ? 'user' : 'admin') as 'user' | 'admin';
                                setConfirm({ type: 'role-toggle', email: u.email, targetRole: nuevoRol, message: `¿Cambiar rol de ${u.email} a ${nuevoRol}?` });
                              }}
                            >Cambiar rol</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pedidos</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th><th>Usuario</th><th>Fecha</th><th>Dirección</th><th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.flatMap(u => (u.historialPedidos || []).map(p => ({...p, email: u.email}))).sort((a,b)=> new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime()).map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.email}</td>
                        <td>{new Date(p.fechaPedido).toLocaleString('es-CL')}</td>
                        <td>{p.direccionEnvio || '-'}</td>
                        <td>${p.total.toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Agregar producto</h5>
                  <form onSubmit={handleAddProduct} className="d-grid gap-2">
                    <input className="form-control" placeholder="Nombre" value={form.nombre||''} onChange={e=>setForm({...form, nombre:e.target.value})} />
                    <input className="form-control" placeholder="Categoría" value={form.categoria||''} onChange={e=>setForm({...form, categoria:e.target.value})} />
                    <textarea className="form-control" placeholder="Descripción" value={form.descripcion||''} onChange={e=>setForm({...form, descripcion:e.target.value})} />
                    <div className="row g-2">
                      <div className="col-6"><input type="number" className="form-control" placeholder="Precio" value={form.precio||0} onChange={e=>setForm({...form, precio:Number(e.target.value)})} /></div>
                      <div className="col-6"><input type="number" className="form-control" placeholder="Stock" value={form.stock||0} onChange={e=>setForm({...form, stock:Number(e.target.value)})} /></div>
                    </div>
                    <input className="form-control" placeholder="Imagen (archivo en /images/productos)" value={form.imagen||''} onChange={e=>setForm({...form, imagen:e.target.value})} />
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="perso" checked={!!form.esPersonalizable} onChange={e=>setForm({...form, esPersonalizable:e.target.checked})} />
                      <label htmlFor="perso" className="form-check-label">Es personalizable</label>
                    </div>
                    <button className="btn btn-primary" type="submit">Agregar</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Productos</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(pr => (
                          <ProductRow key={pr.id} pr={pr} onDelete={() => setConfirm({ type: 'product-delete', productId: pr.id, message: `¿Eliminar el producto ${pr.nombre}?` })} onSave={(patch)=>updateProduct(pr.id, patch)} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <p className="mb-0 text-muted">Usa las pestañas para gestionar usuarios, pedidos y productos. Asegúrate de subir las imágenes a <code>/public/images/productos</code>.</p>
            </div>
          </div>
        )}

        <div className="mt-4 d-flex justify-content-between">
          <Link to="/" className="btn btn-sm" style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}>
            Volver al sitio
          </Link>
        </div>

        {/* Global confirm dialog (rendered outside tab panes) */}
        {confirm && (
          <div className="modal-overlay" style={{ position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 2000 }}>
            <div className="modal-content" style={{ background:'#FFF5E1', padding:20, borderRadius:8, maxWidth:420, width:'90%' }}>
              <h5 className="mb-3">Confirmación</h5>
              <p className="mb-4" style={{whiteSpace:'pre-line'}}>{confirm.message}</p>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={()=>setConfirm(null)}>Cancelar</button>
                <button className="btn btn-danger" onClick={() => {
                  if (confirm.type === 'user-delete' && confirm.email) {
                    handleDelete(confirm.email);
                  } else if (confirm.type === 'role-toggle' && confirm.email && confirm.targetRole) {
                    const res = adminUpdateUser(confirm.email, { role: confirm.targetRole as any });
                    setMessage(res.success ? `Rol actualizado a ${confirm.targetRole}` : res.message || 'No se pudo actualizar rol');
                    setTimeout(() => setMessage(''), 3000);
                  } else if (confirm.type === 'product-delete' && confirm.productId) {
                    deleteProduct(confirm.productId);
                    setMessage('Producto eliminado');
                    setTimeout(() => setMessage(''), 3000);
                  }
                  setConfirm(null);
                }}>Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// --- Row component for inline editing ---
const ProductRow: React.FC<{ pr: Producto; onDelete: ()=>void; onSave: (patch: Partial<Producto>)=>void }>=({ pr, onDelete, onSave })=>{
  const [editing, setEditing] = useState(false);
  const [precio, setPrecio] = useState<number>(pr.precio);
  const [stock, setStock] = useState<number>(pr.stock);
  // mantén el campo para futuras ampliaciones; por ahora solo editamos precio/stock
  return (
    <tr>
      <td>{pr.id}</td>
      <td>{pr.nombre}</td>
      <td>
        {editing ? (
          <input type="number" className="form-control form-control-sm" value={precio} onChange={e=>setPrecio(Number(e.target.value))} style={{maxWidth:120}} />
        ) : (
          `$${pr.precio.toLocaleString('es-CL')}`
        )}
      </td>
      <td>
        {editing ? (
          <input type="number" className="form-control form-control-sm" value={stock} onChange={e=>setStock(Number(e.target.value))} style={{maxWidth:100}} />
        ) : (
          pr.stock
        )}
      </td>
      <td className="d-flex gap-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={()=>setEditing(v=>!v)}>{editing?'Cancelar':'Editar'}</button>
        {editing && (
          <button className="btn btn-sm btn-primary" onClick={()=>{ onSave({ precio, stock }); setEditing(false); }}>Guardar</button>
        )}
        {!editing && (
          <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>Eliminar</button>
        )}
      </td>
    </tr>
  );
}