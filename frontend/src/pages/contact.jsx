import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import '../styles/Contact.css'; // Make sure the path is correct for your project

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1 className="contact-title">Get in Touch</h1>
        
        <div className="contact-list">
          {/* Email Section */}
          <div className="contact-item">
            <div className="label-wrapper">
              <Mail size={14} color="rgba(255,255,255,0.5)" />
              <span className="contact-label">Email Address</span>
            </div>
            <a href="mailto:info@belgiumcampus.ac.za" className="contact-link">
              info@belgiumcampus.ac.za
            </a>
          </div>

          {/* Phone Section */}
          <div className="contact-item">
            <div className="label-wrapper">
              <Phone size={14} color="rgba(255,255,255,0.5)" />
              <span className="contact-label">Phone Number</span>
            </div>
            <span className="contact-value">+27 (0)10 593 5368</span>
          </div>

          {/* Address Section */}
          <div className="contact-item">
            <div className="label-wrapper">
              <MapPin size={14} color="rgba(255,255,255,0.5)" />
              <span className="contact-label">Main Campus</span>
            </div>
            <span className="contact-value">
              138 Berg Avenue, Heatherdale,<br />
              Akasia, Pretoria
            </span>
          </div>
        </div>

        <Link to="/" className="back-link-btn">
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back to Chat
        </Link>
      </div>
    </div>
  );
};

export default Contact;