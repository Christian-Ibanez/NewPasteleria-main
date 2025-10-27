import React from 'react';

const Historia: React.FC = () => {
  return (
    <div className="container my-5">
      <section className="historia-section">
        <h2 className="text-center mb-4" style={{ 
          fontFamily: 'Pacifico, cursive',
          color: '#5D4037'
        }}>
          Nuestra Historia
        </h2>
        <div className="row align-items-center">
          <div className="col-md-6">
            <div style={{
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              maxHeight: '400px'
            }}>
              <img 
                src="/images/miniaturas/imagenpasteleria.jpg" 
                alt="Historia de nuestra pastelería" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4" style={{ backgroundColor: '#FFF5E1', borderRadius: '15px' }}>
              <p className="lead mb-4" style={{ color: '#5D4037' }}>
                Nuestra pastelería nació de la pasión por crear momentos dulces y memorables. 
                Cada receta tiene una historia única, transmitida de generación en generación.
              </p>
              <p style={{ color: '#5D4037' }}>
                Utilizamos técnicas tradicionales combinadas con innovación para crear 
                experiencias únicas en cada bocado. Nuestro compromiso con la calidad
                y el sabor nos ha convertido en un referente en la comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="impacto-comunitario mt-5">
        <h2 className="text-center mb-4" style={{ 
          fontFamily: 'Pacifico, cursive',
          color: '#5D4037'
        }}>
          Impacto en la Comunidad
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
              <div className="card-body text-center p-4">
                <i className="bi bi-mortarboard-fill mb-3" style={{ fontSize: '2rem', color: '#FFC0CB' }}></i>
                <h3 className="card-title h4 mb-3" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                  Apoyo Estudiantil
                </h3>
                <p className="card-text" style={{ color: '#5D4037' }}>
                  Colaboramos con escuelas de gastronomía locales, ofreciendo 
                  prácticas y oportunidades de aprendizaje.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
              <div className="card-body text-center p-4">
                <i className="bi bi-basket-fill mb-3" style={{ fontSize: '2rem', color: '#FFC0CB' }}></i>
                <h3 className="card-title h4 mb-3" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                  Ingredientes Locales
                </h3>
                <p className="card-text" style={{ color: '#5D4037' }}>
                  Trabajamos con productores locales para obtener los mejores 
                  ingredientes y apoyar la economía local.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#FFF5E1' }}>
              <div className="card-body text-center p-4">
                <i className="bi bi-recycle mb-3" style={{ fontSize: '2rem', color: '#FFC0CB' }}></i>
                <h3 className="card-title h4 mb-3" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
                  Cero Desperdicios
                </h3>
                <p className="card-text" style={{ color: '#5D4037' }}>
                  Implementamos prácticas sustentables y donamos excedentes 
                  a organizaciones benéficas locales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Historia;