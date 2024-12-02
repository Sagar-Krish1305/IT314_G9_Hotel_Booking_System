
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from './UserContext';
import UserLogo from './UserLogo';
import { SiHotelsdotcom } from "react-icons/si";

function Navbar({ isScrolled }) {
  const { user } = useContext(UserContext);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SiHotelsdotcom className={`text-2xl ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              stayEazy
            </span>
          </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-blue-500`}>Home</Link>
          <Link to="/about" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-blue-500`}>About</Link>
          {user ? (
            <UserLogo />
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign in</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
