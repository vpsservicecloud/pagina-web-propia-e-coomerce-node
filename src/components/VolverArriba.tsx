import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const VolverArriba: React.FC = () => {
  const [esVisible, setEsVisible] = useState(false);

  useEffect(() => {
    const alternarVisibilidad = () => {
      if (window.pageYOffset > 300) {
        setEsVisible(true);
      } else {
        setEsVisible(false);
      }
    };

    window.addEventListener('scroll', alternarVisibilidad);

    return () => window.removeEventListener('scroll', alternarVisibilidad);
  }, []);

  const volverArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      className={`back-to-top ${esVisible ? 'visible' : ''}`} 
      onClick={volverArriba}
      title="Volver arriba"
      aria-label="Volver arriba"
    >
      <ArrowUp size={20} strokeWidth={2} />
    </button>
  );
};

export default VolverArriba;