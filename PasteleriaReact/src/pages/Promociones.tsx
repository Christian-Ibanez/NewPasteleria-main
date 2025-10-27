import React from 'react';

const Promociones: React.FC = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
        Promociones
      </h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <img src="/images/banner/promocion1.jpg" className="card-img-top" alt="Promoción 1" />
            <div className="card-body">
              <h5 className="card-title">Descuento de Temporada</h5>
              <p className="card-text text-muted">10% de descuento en tortas seleccionadas.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <img src="/images/banner/promocion2.jpg" className="card-img-top" alt="Promoción 2" />
            <div className="card-body">
              <h5 className="card-title">Envío Gratis</h5>
              <p className="card-text text-muted">En pedidos sobre $50.000 dentro de la ciudad.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promociones;
