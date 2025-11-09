import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useProducts } from '../../context/ProductsContext';
import type { Producto } from '../../data/productos';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from 'recharts';

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

  // Filter para pedidos por método de pago
  const [orderFilterPayment, setOrderFilterPayment] = useState<'all' | 'efectivo' | 'tarjeta'>('all');
  // Periodo para gráficos de ventas
  const [salesPeriod, setSalesPeriod] = useState<'daily'|'weekly'|'monthly'>('daily');

  // Form state for products
  const [form, setForm] = useState<Partial<Producto>>({
    id: '', nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false,
  });

  // Categorías existentes (para menú desplegable en agregar producto)
  const categoriasDisponibles = useMemo(() => {
    try {
      return Array.from(new Set(products.map(p => p.categoria).filter(Boolean))).sort();
    } catch {
      return [] as string[];
    }
  }, [products]);
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

  // helper: redimensiona y center-crop a un tamaño fijo, devuelve dataURL
  const resizeImage = (file: File, targetW = 400, targetH = 300): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject('Error leyendo archivo');
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject('Error cargando imagen');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No se pudo obtener contexto');

          // cover / center-crop
          const ratio = Math.max(targetW / img.width, targetH / img.height);
          const sw = targetW / ratio;
          const sh = targetH / ratio;
          const sx = (img.width - sw) / 2;
          const sy = (img.height - sh) / 2;

          // fondo blanco para evitar transparencias no deseadas
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetW, targetH);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

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

  // Pedidos derivados y filtrado por método de pago
  const allOrders = useMemo(() => users.flatMap(u => (u.historialPedidos || []).map(p => ({ ...p, email: u.email }))), [users]);
  const filteredSortedOrders = useMemo(() => {
    const filtered = allOrders.filter(o => {
      if (orderFilterPayment === 'all') return true;
      return (o as any).metodoPago === orderFilterPayment;
    });
    return filtered.sort((a, b) => new Date((b as any).fechaPedido).getTime() - new Date((a as any).fechaPedido).getTime());
  }, [allOrders, orderFilterPayment]);

  // --- Helpers para métricas y gráficos (sin librerías externas) ---
  type SeriesPoint = { label: string; value: number };

  // Paleta de colores para charts
  const CHART_COLORS = {
    areaStroke: '#4caf50', // verde
    areaGradientStart: '#4caf50',
    areaGradientEnd: '#e8f5e9',
    barFill: '#ff7043' // naranja
  };

  const getSalesSeries = (period: 'daily'|'weekly'|'monthly'): SeriesPoint[] => {
    const now = new Date();
    const orders = allOrders.map(o => ({ ...o, fecha: new Date((o as any).fechaPedido) }));
    if (period === 'daily') {
      // Últimos 14 días
      const days = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (13 - i));
        d.setHours(0,0,0,0);
        return d;
      });
      return days.map(d => ({
        label: d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
        value: orders.filter(o => {
          const fd = o.fecha;
          return fd.getFullYear() === d.getFullYear() && fd.getMonth() === d.getMonth() && fd.getDate() === d.getDate();
        }).reduce((s, o) => s + ((o as any).total || 0), 0)
      }));
    }
    if (period === 'weekly') {
      // Últimas 12 semanas (por semana calendario, lunes)
      const weeks = Array.from({ length: 12 }).map((_, i) => {
        const start = new Date(now);
        start.setDate(now.getDate() - ((11 - i) * 7));
        start.setHours(0,0,0,0);
        // mover al lunes de esa semana
        const day = start.getDay();
        const diff = (day + 6) % 7; // lunes offset
        start.setDate(start.getDate() - diff);
        return start;
      });
      return weeks.map(w => {
        const end = new Date(w);
        end.setDate(w.getDate() + 6);
        return {
          label: `S ${w.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}`,
          value: orders.filter(o => {
            const fd = o.fecha;
            return fd >= w && fd <= end;
          }).reduce((s, o) => s + ((o as any).total || 0), 0)
        };
      });
    }
    // monthly: últimos 12 meses
    const months = Array.from({ length: 12 }).map((_, i) => {
      const m = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return m;
    });
    return months.map(m => ({
      label: m.toLocaleDateString('es-CL', { month: 'short' }),
      value: orders.filter(o => {
        const fd = o.fecha;
        return fd.getFullYear() === m.getFullYear() && fd.getMonth() === m.getMonth();
      }).reduce((s, o) => s + ((o as any).total || 0), 0)
    }));
  };

  const getTopProducts = (topN = 5) => {
    const counts: Record<string, { nombre: string; qty: number; revenue: number }> = {};
    allOrders.forEach(o => {
      (o as any).productos?.forEach((item: any) => {
        const id = item.productoId || item.productId || item.id || item.nombre;
        if (!counts[id]) counts[id] = { nombre: item.nombre || id, qty: 0, revenue: 0 };
        counts[id].qty += Number(item.cantidad || 0);
        counts[id].revenue += Number((item.precio || 0) * (item.cantidad || 0));
      });
    });
    return Object.entries(counts).map(([id, v]) => ({ id, nombre: v.nombre, qty: v.qty, revenue: v.revenue })).sort((a,b)=>b.qty-a.qty).slice(0, topN);
  };

  // (Charts now rendered with Recharts components below)

  // Cambiar estado de pedido: actualiza historialPedidos del usuario vía adminUpdateUser
  const handleChangeOrderStatus = (orderId: string, userEmail: string, newStatus: string) => {
    const user = users.find(u => u.email === userEmail);
    if (!user) {
      setMessage('Usuario no encontrado para el pedido');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const updatedPedidos = (user.historialPedidos || []).map(p => p.id === orderId ? { ...p, estado: newStatus } : p);
    const res = adminUpdateUser(userEmail, { historialPedidos: updatedPedidos });
    setMessage(res?.success ? `Estado actualizado a "${newStatus}"` : (res?.message || 'No se pudo actualizar estado'));
    setTimeout(() => setMessage(''), 3000);
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
      nombre: form.nombre!, descripcion: form.descripcion!, categoria: form.categoria!, precio: precio,
      imagen: form.imagen, stock: stockVal, esPersonalizable: !!form.esPersonalizable,
    });
    setForm({ id: '', nombre: '', descripcion: '', precio: 0, categoria: '', imagen: '', stock: 0, esPersonalizable: false });
    setMessage(`Producto agregado — ID: ${idVal} · Precio: $${precio.toLocaleString('es-CL')} · Stock: ${stockVal}`);
    setTimeout(() => setMessage(''), 4000);
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
                <div className="d-flex gap-2 mb-3 align-items-center">
                  <label className="small text-muted mb-0">Filtrar pago:</label>
                  <select className="form-select form-select-sm" style={{ width: 160 }} value={orderFilterPayment} onChange={(e) => setOrderFilterPayment(e.target.value as any)}>
                    <option value="all">Todos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>

                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th><th>Usuario</th><th>Fecha</th><th>Dirección</th><th>Total</th><th>Pago</th><th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSortedOrders.map(p => {
                      const estadoActual = (p as any).estado || 'En proceso';
                      return (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{(p as any).email}</td>
                          <td>{new Date((p as any).fechaPedido).toLocaleString('es-CL')}</td>
                          <td>{(p as any).direccionEnvio || '-'}</td>
                          <td>${(p as any).total?.toLocaleString('es-CL') || 0}</td>
                          <td>
                            {(p as any).metodoPago === 'efectivo' ? 'Efectivo' : `Tarjeta ****${(p as any).tarjetaUltimos4 ?? '----'}`}
                          </td>
                          <td style={{minWidth:160}}>
                            <select
                              className="form-select form-select-sm"
                              value={estadoActual}
                              onChange={(e) => handleChangeOrderStatus(p.id, (p as any).email, e.target.value)}
                            >
                              <option>En proceso</option>
                              <option>En camino</option>
                              <option>Entregado</option>
                              <option>Cancelado</option>
                            </select>
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

        {activeTab === 'products' && (
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Agregar producto</h5>
                  <form onSubmit={handleAddProduct} className="d-grid gap-2">
                    <input
                      className="form-control"
                      placeholder="ID (Alfanumérico)"
                      value={form.id || ''}
                      maxLength={6}
                      onChange={e => setForm({ ...form, id: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0,6) })}
                    />
                    <input className="form-control" placeholder="Nombre" value={form.nombre||''} onChange={e=>setForm({...form, nombre:e.target.value})} />
                    {/* Categoría: si hay categorías existentes, ofrecemos un select; también se puede elegir "Otra" para escribir una nueva */}
                    {categoriasDisponibles.length > 0 ? (
                      <>
                        <select
                          className="form-select"
                          value={showCustomCategory ? '__other__' : (form.categoria || '')}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === '__other__') {
                              setShowCustomCategory(true);
                              setForm({ ...form, categoria: '' });
                            } else {
                              setShowCustomCategory(false);
                              setForm({ ...form, categoria: v });
                            }
                          }}
                        >
                          <option value="">Selecciona una categoría...</option>
                          {categoriasDisponibles.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="__other__">Otra...</option>
                        </select>
                        {showCustomCategory && (
                          <input className="form-control mt-2" placeholder="Escribe la categoría" value={form.categoria||''} onChange={e=>setForm({...form, categoria:e.target.value})} />
                        )}
                      </>
                    ) : (
                      <input className="form-control" placeholder="Categoría" value={form.categoria||''} onChange={e=>setForm({...form, categoria:e.target.value})} />
                    )}
                    <textarea className="form-control" placeholder="Descripción" value={form.descripcion||''} onChange={e=>setForm({...form, descripcion:e.target.value})} />
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label small mb-1">Precio</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            aria-label="Precio"
                              type="number"
                              min="0"
                              step="1000"
                            className="form-control"
                            placeholder="0"
                            value={form.precio ?? ''}
                            onChange={e => setForm({ ...form, precio: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <label className="form-label small mb-1">Stock</label>
                        <input
                          aria-label="Stock"
                          type="number"
                          min="0"
                          step="1"
                          className="form-control"
                          placeholder="0"
                          value={form.stock ?? ''}
                          onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Imagen: ahora aceptamos archivo, redimensionamos y mostramos preview */}
                    <label className="form-label small mt-2">Imagen (archivo) <small className="text-muted">se adapta al tamaño estándar</small></label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const data = await resizeImage(file, 400, 300);
                          setForm({ ...form, imagen: data });
                        } catch (err) {
                          setMessage(typeof err === 'string' ? err : 'No se pudo procesar la imagen');
                          setTimeout(() => setMessage(''), 3000);
                        }
                      }}
                    />
                    {form.imagen && (
                      <div style={{ marginTop: 8 }}>
                        <div className="small text-muted">Preview:</div>
                        <img src={form.imagen} alt="preview" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4, marginTop: 6, border: '1px solid #e6e6e6' }} />
                      </div>
                    )}
                    <div className="form-check mt-2">
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
                          <th>ID</th><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(pr => (
                          <ProductRow key={pr.id} pr={pr} onDelete={() => setConfirm({ type: 'product-delete', productId: pr.id, message: `¿Eliminar el producto ${pr.nombre}?` })} onSave={(patch)=>updateProduct(pr.id, patch)} setMessage={setMessage} />
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
              <div className="row g-3">
                <div className="col-md-6">
                  <h6>Ventas ({salesPeriod === 'daily' ? 'Diarias' : salesPeriod === 'weekly' ? 'Semanales' : 'Mensuales'})</h6>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <select className="form-select form-select-sm" style={{ width: 160 }} value={salesPeriod} onChange={(e) => setSalesPeriod(e.target.value as any)}>
                      <option value="daily">Diario (14d)</option>
                      <option value="weekly">Semanal (12s)</option>
                      <option value="monthly">Mensual (12m)</option>
                    </select>
                    <div className="small text-muted">Total período: <strong>{'$' + getSalesSeries(salesPeriod).reduce((s, p) => s + p.value, 0).toLocaleString('es-CL')}</strong></div>
                  </div>
                  <div style={{ width: '100%', minHeight: 160 }}>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={getSalesSeries(salesPeriod)}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.areaGradientStart} stopOpacity={0.9}/>
                            <stop offset="95%" stopColor={CHART_COLORS.areaGradientEnd} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                        <YAxis tickFormatter={(v: number | string) => `$${Number(v).toLocaleString('es-CL')}`} />
                        <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString('es-CL')}`} />
                        <Area type="monotone" dataKey="value" stroke={CHART_COLORS.areaStroke} strokeWidth={2} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-2 small text-muted">Últimos puntos: {getSalesSeries(salesPeriod).slice(-3).map(p => `${p.label} ${p.value.toLocaleString('es-CL')}`).join(' · ')}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6>Productos más vendidos</h6>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div>
                      {(() => {
                        const top = getTopProducts(5);
                        return (
                          <div>
                            <div style={{ width: '100%', height: 140 }}>
                              <ResponsiveContainer width="100%" height={140}>
                                <BarChart data={top.map(t=>({ name: t.nombre, qty: t.qty }))}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="qty" fill={CHART_COLORS.barFill} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <ul className="list-unstyled small mt-2 mb-0">
                              {top.map(t => (
                                <li key={t.id}><strong>{t.nombre}</strong> · {t.qty} uds · {'$' + t.revenue.toLocaleString('es-CL')}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <h6>Alertas</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {products.filter(p => p.stock <= 5).length === 0 ? (
                      <div className="small text-muted">No hay productos con bajo stock (&lt;=5).</div>
                    ) : (
                      products.filter(p => p.stock <= 5).map(p => (
                        <div key={p.id} className="badge bg-danger text-wrap" style={{ padding: '8px 10px', marginRight: 6 }}>
                          {p.nombre} · Stock: {p.stock}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-sm"
            style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
            onClick={handleLogout}
          >
            Volver al sitio
          </button>
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
const ProductRow: React.FC<{ pr: Producto; onDelete: ()=>void; onSave: (patch: Partial<Producto>)=>void; setMessage: (msg: string) => void }> = ({ pr, onDelete, onSave, setMessage }) => {
  const [editing, setEditing] = useState(false);
  const [precio, setPrecio] = useState<number>(pr.precio);
  const [stock, setStock] = useState<number>(pr.stock);

  const resolveImageSrc = (img?: string) => {
    if (!img) return '/images/productos/default.png';
    if (img.startsWith('data:') || img.startsWith('/')) return img;
    return `/images/productos/${img}`;
  };

  const thumbStyle: React.CSSProperties = { width: 80, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #e6e6e6' };

  return (
    <tr>
      <td>{pr.id}</td>
      <td>
        <img src={resolveImageSrc(pr.imagen)} alt={pr.nombre} style={thumbStyle} />
      </td>
      <td>{pr.nombre}</td>
      <td>
        {editing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={precio}
            onChange={e => setPrecio(Number(e.target.value))}
            style={{ maxWidth: 120 }}
            min={0}
            step={1000} // incrementar/decrementar de 1000 en 1000
          />
        ) : (
          `$${pr.precio.toLocaleString('es-CL')}`
        )}
      </td>
      <td>
        {editing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={stock}
            onChange={e => setStock(Number(e.target.value))}
            style={{ maxWidth: 100 }}
          />
        ) : (
          pr.stock
        )}
      </td>
      <td className="d-flex gap-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(v => !v)}>{editing ? 'Cancelar' : 'Editar'}</button>
        {editing && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              if (precio <= 0) {
                setMessage('El precio debe ser mayor a 0');
                setTimeout(() => setMessage(''), 3000);
                return;
              }
              onSave({ precio, stock });
              setEditing(false);
            }}
          >
            Guardar
          </button>
        )}
        {!editing && (
          <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>Eliminar</button>
        )}
      </td>
    </tr>
  );
};