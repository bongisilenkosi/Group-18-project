import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/bc-logo.jpeg';

function Navbar() {
  return (
    <nav className="glass-navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <img src={logo} alt="Belgium Campus" className="brand-logo-img" />
          <span className="brand-logo">BC <span className="highlight">CourseFinder</span></span>
        </Link>
      </div>

      <div className="nav-links">
        {/* Home link removed! Clicking the logo handles this now. */}
        <Link to="/about" className="nav-item">About</Link>
        <Link to="/aps" className="nav-item calc-link">APS Calculator</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-link">Log In</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;