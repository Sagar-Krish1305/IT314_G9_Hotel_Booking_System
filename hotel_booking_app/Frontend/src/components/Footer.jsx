import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import FooterBg from './footer-bg.jpg';

function Footer() {
  return (
    <footer
      className="bg-white font-montserrat py-10 px-5 text-center relative overflow-hidden shadow-[0_-2px_4px_rgba(0,0,0,0.1)]"
      style={{
        backgroundImage: `url(${FooterBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10">
        <div className="footer-logo mb-5">
          <Link to="/" className="no-underline flex items-center justify-center">
            <FiHome className="text-4xl text-[#007b7b] mr-2" />
            <span className="text-[#007b7b] font-bold text-2xl">Hotel Booking.</span>
          </Link>
        </div>

        <nav className="flex justify-center gap-10 mb-5">
          <a href="#" className="text-base text-gray-700 font-bold hover:text-[#007b7b] transition-colors duration-300">Hotels</a>
          <a href="#" className="text-base text-gray-700 font-bold hover:text-[#007b7b] transition-colors duration-300">Listing</a>
          <a href="#" className="text-base text-gray-700 font-bold hover:text-[#007b7b] transition-colors duration-300">Pricing</a>
          <a href="#" className="text-base text-gray-700 font-bold hover:text-[#007b7b] transition-colors duration-300">Privacy</a>
          <Link to="/members" className="text-base text-gray-700 font-bold hover:text-[#007b7b] transition-colors duration-300">Members</Link>
          <Link to="/about" className="text-base text-gray-700 font-bold hover:text-[#007b7b] transition-colors duration-300">About Us</Link>
        </nav>

        <div className="text-sm text-gray-400 font-bold mt-5">
          ©️ 2024 Hotel Booking. All rights reserved.
        </div>
      </div>

      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-[150px] h-[150px] bg-contain bg-no-repeat bg-center -z-10"></div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[150px] h-[150px] bg-contain bg-no-repeat bg-center -z-10"></div>
    </footer>
  );
}

export default Footer;

