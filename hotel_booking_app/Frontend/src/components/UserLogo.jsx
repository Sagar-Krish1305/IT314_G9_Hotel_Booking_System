import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function UserLogo() {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast.success("User Logout successfully");
    navigate('/');
  };

  return (
    <div className="relative">
      <div 
        className="w-10 h-10 rounded-full bg-purple-700 text-white flex justify-center items-center font-bold cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {initials}
      </div>
      {isOpen && (
        <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md p-2 mt-1 flex flex-col">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-transparent border-none p-2 text-left cursor-pointer hover:bg-gray-100"
          >
            Profile
          </button>
          <button 
            onClick={handleLogout}
            className="bg-transparent border-none p-2 text-left cursor-pointer hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}