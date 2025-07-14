import React from 'react';
import { useNavegacion } from '../hooks/useNavegacion';

interface PropsSeccionHero {
  titulo?: string;
  subtitulo?: string;
  textoBoton?: string;
  imagenFondo?: string;
}

const SeccionHero: React.FC<PropsSeccionHero> = ({
  titulo = "Productos de Calidad Premium",
  subtitulo = "Descubre nuestra colección exclusiva de productos de alta calidad a precios competitivos",
  textoBoton = "Comprar Ahora",
  imagenFondo = "https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1600"
}) => {
  const { navegarA } = useNavegacion();

  return (
    <section 
      className="hero-section py-5" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imagenFondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="hero-content p-4 text-white fade-in">
              <h1 className="display-4 fw-bold mb-3">{titulo}</h1>
              <p className="lead mb-4">{subtitulo}</p>
              <button 
                className="btn btn-primary btn-lg rounded-pill px-4"
                onClick={() => navegarA('/tienda')}
              >
                {textoBoton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeccionHero;