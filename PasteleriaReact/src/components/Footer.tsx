import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-5 py-4" style={{ backgroundColor: '#FFF5E1' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Pastelería Mil Sabores</h5>
            <p className="text-muted">
              Endulzando momentos especiales desde 2023
            </p>
            <div className="social-links">
              <a href="#" className="me-3" style={{ color: '#5D4037' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="me-3" style={{ color: '#5D4037' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="me-3" style={{ color: '#5D4037' }}>
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/nuestra-historia" style={{ color: '#5D4037', textDecoration: 'none' }}>
                  Nuestra Historia
                </Link>
              </li>
              <li>
                <Link to="/promociones" style={{ color: '#5D4037', textDecoration: 'none' }}>
                  Promociones
                </Link>
              </li>
              <li>
                <Link to="/catalogo" style={{ color: '#5D4037', textDecoration: 'none' }}>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/contacto" style={{ color: '#5D4037', textDecoration: 'none' }}>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-3">
            <h5 style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>Contáctanos</h5>
            <address className="text-muted">
              <p>📍 Av. Principal 123, Santiago</p>
              <p>📞 +56 9 1234 5678</p>
              <p>✉️ contacto@pasteleriamilsabores.cl</p>
            </address>
            <p className="mb-0">
              <strong>Horario de Atención:</strong><br />
              Lunes a Sábado: 9:00 - 19:00<br />
              Domingo: 10:00 - 16:00
            </p>
          </div>
        </div>
        
        <hr className="my-4" style={{ borderColor: '#5D4037' }} />
        
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted">
              © {new Date().getFullYear()} Pastelería Mil Sabores. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;