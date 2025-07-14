import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <a 
      id="toTop" 
      className={`back-to-top ${isVisible ? 'visible' : ''}`} 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}
      title="Back to top"
      aria-label="Back to top"
    >
      <ArrowUp size={20} strokeWidth={2} />
    </a>
  );
};

export default BackToTop;