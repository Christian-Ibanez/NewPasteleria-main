import React from 'react';
import { Link } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';

const Home: React.FC = () => {
  return (
    <div>
      {/* Banner Principal */}
      <header className="py-5 text-center" style={{ backgroundColor: '#FFF5E1', borderBottom: '3px solid #FFC0CB' }}>
        <div className="container">
          <h1 className="display-4 mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
            Pastelería Mil Sabores
          </h1>

          <p className="lead mb-3 text-start mx-auto" style={{ color: '#5D4037', maxWidth: 900 }}>
            Pastelería 1000 Sabores celebra su 50 aniversario como un referente en la repostería chilena. Famosa por su participación en un récord Guinness en 1995, cuando colaboró en la creación de la torta más grande del mundo, la pastelería busca renovar su sistema de ventas online para ofrecer una experiencia de compra moderna y accesible para sus clientes.
          </p>

          <h3 className="mt-4" style={{ color: '#5D4037' }}>Misión</h3>
          <p className="text-muted mx-auto" style={{ maxWidth: 900 }}>
            Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.
          </p>

          <h3 className="mt-4" style={{ color: '#5D4037' }}>Visión</h3>
          <p className="text-muted mx-auto" style={{ maxWidth: 900 }}>
            Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.
          </p>

          <div className="text-center mt-4">
            <Link to="/catalogo" className="btn btn-lg" style={{ backgroundColor: '#FFC0CB', borderColor: '#FFC0CB', color: '#5D4037' }}>
              Ver Catálogo
            </Link>
          </div>
        </div>
      </header>

      {/* Carrusel de Productos */}
      <ProductCarousel />

      {/* Sección de Categorías */}
      <section className="container my-5">
        <h2 className="text-center mb-4" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>
          Nuestras Categorías
        </h2>

        <div className="row g-4">
          {[
            { nombre: 'Tortas', imagen: 'tortas.jpg' },
            { nombre: 'Pasteles', imagen: 'pasteles.jpg' },
            { nombre: 'Sin Azúcar', imagen: 'sin-azucar.jpg' },
            { nombre: 'Veganos', imagen: 'veganos.jpg' }
          ].map((categoria) => (
            <div key={categoria.nombre} className="col-md-3">
              <div className="card h-100 shadow-sm" style={{ backgroundColor: '#FFF5E1', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={`/images/categorias/${categoria.imagen}`} className="card-img-top" alt={categoria.nombre} style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title mb-0" style={{ fontFamily: 'Pacifico, cursive', color: '#5D4037' }}>{categoria.nombre}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;