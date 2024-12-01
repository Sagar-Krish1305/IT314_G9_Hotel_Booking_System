import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function UserLogo() {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [initials, setInitials] = useState('?');
  const navigate = useNavigate();

  // If `user` is null or undefined, don't render the component.


  useEffect(() => {

    console.log("my", user);

    if (!user) return null;

    setInitials(`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || '?');

  }, [user])


  const handleLogout = () => {
    setUser(null);
    // localStorage.removeItem('token');
    Cookies.remove('token');
    toast.success("User Logout successfully");
    navigate('/');
  };

  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-full bg-blue-700 text-white flex justify-center items-center font-bold cursor-pointer"
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
