import React from 'react';
import type { Producto } from '../types';

interface RecomendacionesProps {
  historialCompras?: Producto[];
  preferencias?: string[];
}

const Recomendaciones: React.FC<RecomendacionesProps> = ({ historialCompras, preferencias }) => {
  return (
    <div className="recomendaciones">
      <h2 className="text-center mb-4">Recomendaciones para Ti</h2>
      
      {/* Mensaje personalizado basado en preferencias */}
      {preferencias && preferencias.length > 0 && (
        <p className="text-center mb-4">
          Basado en tu amor por {preferencias.join(', ')}
        </p>
      )}

      <div className="row">
        {/* Aquí irían las tarjetas de productos recomendados */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img 
              src="/images/producto-recomendado.jpg" 
              className="card-img-top" 
              alt="Producto recomendado"
            />
            <div className="card-body">
              <h5 className="card-title">Producto Recomendado</h5>
              <p className="card-text">
                Basado en tus compras anteriores, creemos que te encantará este producto.
              </p>
            </div>
          </div>
        </div>

        {/* Más tarjetas de recomendaciones aquí */}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary">
          Ver Más Recomendaciones
        </button>
      </div>
    </div>
  );
};

export default Recomendaciones;