
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from './UserContext';
import UserLogo from './UserLogo';

function Navbar2({ isScrolled }) {
    const { user } = useContext(UserContext);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-blue-600 shadow-md' : 'bg-blue-600 shadow-md'
        }`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                🏨 BestLikeHome
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/home" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-gray-400`}>Home</Link>
              <Link to="/about" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-gray-400`}>About</Link>
              {user ? (
                <UserLogo />
              ) : (
                <>
                  <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-500">Sign in</Link>
                  <Link to="/signup" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-500">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
    );
}

export default Navbar2;