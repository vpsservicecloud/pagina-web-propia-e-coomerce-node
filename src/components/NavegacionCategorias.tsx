import React from 'react';
import { categorias } from '../data/productos';
import { useNavegacion } from '../hooks/useNavegacion';

const NavegacionCategorias: React.FC = () => {
  const { navegarA } = useNavegacion();

  return (
    <nav className="category-nav py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-center flex-wrap">
              {categorias.map(categoria => (
                <button 
                  key={categoria.id} 
                  className="btn btn-outline-secondary rounded-pill m-1"
                  onClick={() => navegarA(categoria.url)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavegacionCategorias;