import React, { useState, useMemo } from 'react';
import { CATALOGO_PRODUCTOS } from '../data/productos';
import type { Producto } from '../data/productos';
import { useCart } from '../context/CartContext';
// Importamos 'Container', 'Row' y 'Col' de react-bootstrap si lo usas, 
// o simplemente clases de Bootstrap si no. Usaremos clases simples para este ejemplo.

// Componente para una tarjeta de producto
const TarjetaProducto: React.FC<{ producto: Producto }> = ({ producto }) => {
  const { addItem } = useCart();

  const estiloTarjeta: React.CSSProperties = {
    backgroundColor: '#FFF5E1',
    color: '#5D4037',
    fontFamily: 'Lato, sans-serif'
  };

  // --- NUEVO: estado para personalización inline ---
  const [personalizarVisible, setPersonalizarVisible] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const CHAR_LIMIT = 200;

  const handleComprar = () => {
    addItem({
      producto: producto,
      cantidad: 1,
      personalizacion: mensaje?.trim() || undefined
    });
    
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#FFC0CB';
    notification.style.color = '#5D4037';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.5s';
    notification.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display:flex; align-items: center; gap:10px;">
          <i class="bi bi-cart-check"></i>
          ¡${producto.nombre} añadido al carrito!
        </div>
        ${mensaje ? `<small style="color:#5D4037; opacity:0.9;">Mensaje: ${escapeHtml(mensaje)}</small>` : ''}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 2000);
  };

  // Helper para escapar HTML simple en la notificación
  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm" style={estiloTarjeta}>
        <div className="card-img-container" style={{ height: '200px', overflow: 'hidden' }}>
          <img
            src={`/images/productos/${(producto.imagen ?? producto.codigo).toLowerCase()}`}
            className="card-img-top"
            alt={producto.nombre}
            style={{
              objectFit: 'cover',
              height: '100%',
              width: '100%'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/productos/placeholder.jpg';
            }}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{ fontFamily: 'Pacifico, cursive' }}>
            {producto.nombre}
          </h5>
          <p className="card-text text-muted" style={{ color: '#5D4037' }}>
            {producto.descripcion}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-auto mb-3">
            <p className="fw-bold fs-5 mb-0">${producto.precio.toLocaleString('es-CL')} CLP</p>
            {producto.esPersonalizable && (
              <span className="badge" style={{ backgroundColor: '#FFC0CB', color: '#5D4037' }}>
                Personalizable
              </span>
            )}
          </div>

          {/* --- Cambiado: ahora TODOS los productos permiten personalizar inline --- */}
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-sm w-100 mb-2"
              onClick={() => setPersonalizarVisible(v => !v)}
              style={personalizarVisible
                ? { backgroundColor: '#f8c3d0', borderColor: '#FFC0CB', color: '#5D4037' }
                : { backgroundColor: '#fff', borderColor: '#FFC0CB', color: '#5D4037' }}
            >
              {personalizarVisible ? 'Ocultar personalización' : 'Personalizar mensaje'}
            </button>

            {personalizarVisible && (
              <div className="d-flex flex-column">
                <textarea
                  className="form-control mb-2"
                  placeholder="Escribe el mensaje para el pastel (ej. 'Feliz Cumple, María')"
                  value={mensaje}
                  onChange={(e) => {
                    if (e.target.value.length <= CHAR_LIMIT) setMensaje(e.target.value);
                  }}
                  rows={3}
                  style={{ borderColor: '#FFC0CB', resize: 'vertical' }}
                />
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">{mensaje.length}/{CHAR_LIMIT}</small>
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm me-2"
                      onClick={() => setMensaje('')}
                      style={{ borderColor: '#FFC0CB', color: '#5D4037' }}
                    >
                      Limpiar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        // opción: mantener el textarea abierto; aquí solo confirmamos guardado visualmente
                        setPersonalizarVisible(false);
                      }}
                      style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
                    >
                      Guardar mensaje
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            className="btn btn-sm w-100" 
            style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
            onClick={handleComprar}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};


// Componente principal del Catálogo
const Catalogo: React.FC = () => {
  const productos = CATALOGO_PRODUCTOS;
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<string[]>([]);

  // Categorías disponibles
  const categorias = [
    { id: 'Tortas Cuadradas', label: 'Tortas Cuadradas' },
    { id: 'Tortas Circulares', label: 'Tortas Redondas' },
    { id: 'Productos Sin Gluten', label: 'Sin Gluten' },
    { id: 'Productos Vegana', label: 'Vegana' },
    { id: 'Postres Individuales', label: 'Individual' },
  ];

  // Filtrar productos basado en búsqueda y categorías seleccionadas
  const productosFiltrados = useMemo(() => {
    return productos.filter(producto => {
      const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = filtros.length === 0 || filtros.includes(producto.categoria);
      return matchBusqueda && matchCategoria;
    });
  }, [productos, busqueda, filtros]);

  // Manejar cambios en filtros
  const handleFiltroChange = (categoria: string) => {
    setFiltros(prev => {
      if (prev.includes(categoria)) {
        return prev.filter(cat => cat !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
        Nuestro Catálogo de Dulzura
      </h1>
      
      {/* Zona de Búsqueda y Filtros */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#FFF5E1', border: '1px solid #FFC0CB' }}>
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ border: '1px solid #FFC0CB' }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-wrap gap-2">
            {categorias.map(({ id, label }) => (
              <button
                key={id}
                className={`btn btn-sm ${filtros.includes(id) ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleFiltroChange(id)}
                style={filtros.includes(id) 
                  ? { backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }
                  : { borderColor: '#FFC0CB', color: '#5D4037' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="col-12 mt-2">
          <p className="text-center text-secondary">
            {productosFiltrados.length} productos encontrados
          </p>
        </div>
      </div>

      {/* Listado de Productos (Grid de Bootstrap) */}
      <div className="row">
        {productosFiltrados.map((producto) => (
          <TarjetaProducto key={producto.codigo} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default Catalogo;