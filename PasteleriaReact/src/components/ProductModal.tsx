import React, { useEffect, useState } from 'react';
import type { Producto } from '../data/productos';
import { useCart } from '../context/CartContext';

interface Props {
  producto?: Producto | null;
  visible: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<Props> = ({ producto, visible, onClose }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (visible) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [visible, onClose]);

  if (!visible || !producto) return null;

  const resolveImageSrc = (imagen?: string, codigo?: string) => {
    if (!imagen && !codigo) return '/images/productos/placeholder.jpg';
    if (imagen && imagen.startsWith('data:')) return imagen;
    if (imagen && (imagen.startsWith('/') || imagen.startsWith('http'))) return imagen;
    const name = imagen || codigo || 'placeholder.jpg';
    return `/images/productos/${name.toLowerCase()}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="product-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '1rem'
      }}
    >
      <div
        className="product-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900,
          width: '100%',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          gap: 20,
          overflow: 'hidden',
          alignItems: 'stretch'
        }}
      >
        {/* Image container with fixed height to normalize modal size for all images */}
        <div style={{ flex: '0 0 50%', height: 420, maxHeight: '80vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={resolveImageSrc(producto.imagen, producto.codigo)}
            alt={producto.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.src = '/images/productos/placeholder.jpg';
            }}
          />
        </div>
        <div style={{ padding: 20, flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h2 style={{ margin: 0, fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>{producto.nombre}</h2>
            <button
              aria-label="Cerrar"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <p style={{ color: '#5D4037', marginTop: 8 }}>{producto.descripcion}</p>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>${producto.precio.toLocaleString('es-CL')} CLP</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn"
                onClick={async () => {
                  if (adding) return;
                  setAdding(true);
                  try {
                    addItem({ producto, cantidad: 1 });

                    // small DOM notification similar to catalog
                    const notification = document.createElement('div');
                    notification.style.position = 'fixed';
                    notification.style.bottom = '20px';
                    notification.style.right = '20px';
                    notification.style.backgroundColor = '#FFC0CB';
                    notification.style.color = '#5D4037';
                    notification.style.padding = '12px 18px';
                    notification.style.borderRadius = '5px';
                    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                    notification.style.zIndex = '2000';
                    notification.style.transition = 'opacity 0.4s';
                    notification.textContent = `¡${producto.nombre} añadido al carrito!`;
                    document.body.appendChild(notification);
                    setTimeout(() => {
                      notification.style.opacity = '0';
                      setTimeout(() => document.body.removeChild(notification), 400);
                    }, 1800);
                  } finally {
                    setAdding(false);
                  }
                }}
                style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
              >
                {adding ? 'Añadiendo...' : 'Agregar al carrito'}
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={onClose}
                style={{ borderColor: '#FFC0CB', color: '#5D4037' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
