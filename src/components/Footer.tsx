import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';

interface FooterProps {
  siteLogo?: string;
  year?: number;
  companyName?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  siteLogo = "https://via.placeholder.com/150x50",
  year = 2025,
  companyName = "Your Company"
}) => {
  return (
    <footer className="footer mt-auto py-5 bg-white">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold mb-4">About Us</h5>
            <p className="text-muted">
              We provide high-quality products and excellent customer service to meet all your needs.
            </p>
            <img src={siteLogo} alt={companyName} height="50" className="mt-2" />
          </div>
          
          <div className="col-md-2">
            <h5 className="fw-bold mb-4">Shop</h5>
            <ul className="list-unstyled">
              <li><a href="/shop" className="text-decoration-none text-muted">All Products</a></li>
              <li><a href="/new" className="text-decoration-none text-muted">New Arrivals</a></li>
              <li><a href="/sale" className="text-decoration-none text-muted">Sale Items</a></li>
              <li><a href="/categories" className="text-decoration-none text-muted">Categories</a></li>
            </ul>
          </div>
          
          <div className="col-md-2">
            <h5 className="fw-bold mb-4">Customer</h5>
            <ul className="list-unstyled">
              <li><a href="/account" className="text-decoration-none text-muted">My Account</a></li>
              <li><a href="/orders" className="text-decoration-none text-muted">Orders</a></li>
              <li><a href="/wishlist" className="text-decoration-none text-muted">Wishlist</a></li>
              <li><a href="/faq" className="text-decoration-none text-muted">FAQ</a></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="fw-bold mb-4">Stay Connected</h5>
            <p className="text-muted">Subscribe to our newsletter for updates and promotions.</p>
            <form>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Your email" aria-label="Email" />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </form>
            <div className="social-links mt-3">
              <a href="#" className="text-decoration-none text-muted" aria-label="Facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-decoration-none text-muted" aria-label="Instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-decoration-none text-muted" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-decoration-none text-muted" aria-label="Youtube">
                <Youtube size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="small text-muted mb-md-0">© {year} {companyName}. All rights reserved.</p>
          </div>
          <div className="col-md-6">
            <ul className="list-inline text-md-end mb-0">
              <li className="list-inline-item">
                <a href="/terms" className="text-decoration-none small text-muted">Terms & Conditions</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="/privacy" className="text-decoration-none small text-muted">Privacy Policy</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="/cookies" className="text-decoration-none small text-muted">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;