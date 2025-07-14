import React, { useState, useEffect } from 'react';
import { Menu, ShoppingCart, User, Search } from 'lucide-react';

interface HeaderProps {
  siteLogo?: string;
  siteTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  siteLogo = "https://via.placeholder.com/180x50", 
  siteTitle = "E-Commerce Store" 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Example cart count

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header">
      <nav className={`navbar navbar-expand-lg navbar-light ${isScrolled ? 'shadow-sm bg-white' : 'bg-white'}`}>
        <div className="container">
          {/* Brand Logo */}
          <a className="navbar-brand" href="/" title="To the home page">
            <img src={siteLogo} alt={siteTitle} height="40" />
          </a>
          
          {/* Mobile Icons */}
          <div className="d-flex d-lg-none ms-auto me-2">
            <a href="/cart" className="btn btn-link position-relative p-1">
              <ShoppingCart size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  {cartCount}
                </span>
              )}
            </a>
            <a href="/account" className="btn btn-link p-1">
              <User size={22} strokeWidth={1.5} />
            </a>
          </div>
          
          {/* Mobile Toggle */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          {/* Navbar Content */}
          <div className="collapse navbar-collapse" id="navbarMain">
            {/* Main Navigation */}
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link px-3" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="/shop">Shop</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="/categories">Categories</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="/about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="/contact">Contact</a>
              </li>
            </ul>
            
            {/* Desktop Search and Account */}
            <div className="d-none d-lg-flex">
              <form className="search-form me-3">
                <div className="input-group">
                  <input 
                    type="search" 
                    className="form-control" 
                    placeholder="Search..." 
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-primary" type="submit">
                    <Search size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
              
              <div className="d-flex align-items-center">
                <a href="/cart" className="btn btn-link position-relative p-1 me-2">
                  <ShoppingCart size={22} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                      {cartCount}
                    </span>
                  )}
                </a>
                <a href="/account" className="btn btn-primary rounded-pill px-4">
                  Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;