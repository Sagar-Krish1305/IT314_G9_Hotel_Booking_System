import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FiHome } from 'react-icons/fi'; 
import FooterBg from '../assets/footer-bg.jpg';

function Footer() {
  return (
    <footer
      className="footer-container"
      style={{
        backgroundImage: `url(${FooterBg})`,
        backgroundSize: 'cover', // Cover the entire footer area
        backgroundRepeat: 'no-repeat', // Prevent repeating the image
        backgroundPosition: 'center', // Center the image
        padding: '40px 20px', // Add padding for spacing
        color: '#fff', // Adjust text color for contrast
      }}
    >

      <div className="footer-logo">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiHome style={{ fontSize: '40px', color: '#007b7b', marginRight: '10px' }} />
          <span style={{ color: '#007b7b', fontWeight: 'bold' }}>Hotel Booking.</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="footer-nav">
        <a href="#">Hotels</a>
        <a href="#">Listing</a>
        <a href="#">Pricing</a>
        <a href="#">Privacy</a>
        <Link to="/members">Members</Link>
        <Link to="/about-us">About Us</Link>
      </nav>

      {/* Copyright */}
      <div className="footer-copyright">
        © 2024 Hotel Booking. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
