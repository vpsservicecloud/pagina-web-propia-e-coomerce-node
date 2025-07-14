import React from 'react';
import { useNavegacion } from '../hooks/useNavegacion';

interface PropsBannerPromo {
  titulo?: string;
  descripcion?: string;
  textoBoton?: string;
  urlImagen?: string;
  colorFondo?: string;
}

const BannerPromo: React.FC<PropsBannerPromo> = ({
  titulo = "Oferta de Verano",
  descripcion = "Hasta 50% de descuento en productos seleccionados. ¡Oferta por tiempo limitado!",
  textoBoton = "Ver Ofertas",
  urlImagen = "https://images.pexels.com/photos/6567607/pexels-photo-6567607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  colorFondo = "#f8f4eb"
}) => {
  const { navegarA } = useNavegacion();

  return (
    <section className="promo-banner py-5" style={{ backgroundColor: colorFondo }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <img 
              src={urlImagen} 
              alt={titulo} 
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
            />
          </div>
          <div className="col-md-6 order-md-1 py-4">
            <div className="p-md-4">
              <h2 className="display-5 fw-bold mb-3">{titulo}</h2>
              <p className="lead mb-4">{descripcion}</p>
              <button 
                className="btn btn-primary rounded-pill px-4"
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

export default BannerPromo;