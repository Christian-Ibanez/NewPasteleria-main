import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../data/productos';
import { useProducts } from '../context/ProductsContext';
import { productosService } from '../services/productosService';
import { resolveImageSrc, handleImageError } from '../utils/imageUtils';

const ProductCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { products: productosLocal } = useProducts();
  const [productosDB, setProductosDB] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde la BD
  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        const data = await productosService.listarProductos();
        
        if (Array.isArray(data) && data.length > 0) {
          setProductosDB(data);
        } else {
          // Fallback a productos locales si la BD está vacía
          setProductosDB(productosLocal);
        }
      } catch (error) {
        console.error('Error cargando productos para carrusel:', error);
        // Fallback a productos locales en caso de error
        setProductosDB(productosLocal);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, [productosLocal]);

  const productos: Producto[] = productosDB.slice(0, 8);

  useEffect(() => {
    if (productos.length > 0) {
      const timer = setInterval(() => {
        setActiveIndex((current) => (current + 1) % Math.max(1, productos.length - 3));
      }, 3000); // Cambia cada 3 segundos

      return () => clearInterval(timer);
    }
  }, [productos.length]);

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <h2 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
          Productos Destacados
        </h2>
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    );
  }

  // Si no hay productos, no mostrar nada
  if (productos.length === 0) {
    return null;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
        Productos Destacados
      </h2>
      
      <div className="position-relative">
        <div className="row">
          {productos.slice(activeIndex, activeIndex + 4).map((producto) => (
            <div key={producto.id || producto.codigo} className="col-md-3">
              <div 
                className="card h-100 shadow-sm" 
                style={{ 
                  backgroundColor: '#FFF5E1',
                  transition: 'transform 0.3s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src={resolveImageSrc(producto.imagen, producto.codigo || producto.id)}
                    className="card-img-top"
                    alt={producto.nombre}
                    onError={handleImageError}
                    style={{
                      objectFit: 'cover',
                      height: '100%',
                      width: '100%'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/productos/imagenpasteleria.jpg';
                    }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                    {producto.nombre}
                  </h5>
                  <p className="card-text text-muted">
                    {producto.descripcion.substring(0, 60)}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0 fw-bold" style={{ color: '#5D4037' }}>
                      ${producto.precio.toLocaleString('es-CL')}
                    </p>
                    <Link
                      to="/catalogo"
                      className="btn btn-sm"
                      style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="d-flex justify-content-center mt-4">
          {Array.from({ length: productos.length - 3 }, (_, i) => (
            <button
              key={i}
              className="btn btn-sm mx-1"
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                padding: 0,
                backgroundColor: i === activeIndex ? '#FFC0CB' : '#5D4037',
                border: 'none'
              }}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;