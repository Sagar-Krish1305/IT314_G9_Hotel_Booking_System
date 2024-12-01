import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import config from '../config';

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  // const [hotelData,setHotelData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const gethoteldata = async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`${config.BACKEND_ID}/api/v1/user/bookig-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // setHotelData(data);
        console.log(data.data);
        navigate('/BookingHistory', { state: { dataa: data.data } });
      } else {
        console.error('Failed to fetch hotel data')
        toast.error('Failed to fetch hotel data')
      }
    } catch (error) {
      console.error('Error fetching hoteldata:', error)
      toast.error('Error fetching hoteldata')
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('You are not authorized. Please log in.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.BACKEND_ID}/api/v1/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedUser),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        Cookies.set('firstname', data.user.firstName, { expires: 7 });
        Cookies.set('lastname', data.user.lastName, { expires: 7 });
        Cookies.set('email', data.user.email, { expires: 7 });
        Cookies.set('mobileno', data.user.mobileNumber, { expires: 7 });
        Cookies.set('userType', data.user.userType, { expires: 7 });
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
    }
  };

  if (!user) {
    return <div className="text-center mt-8">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 bg-blue-600 text-white text-2xl font-bold flex justify-center items-center rounded-full mr-6">
              {user.firstName[0]?.toUpperCase()}{user.lastName[0]?.toUpperCase()}
            </div>
            <h1 className="text-3xl text-gray-800">{user.firstName} {user.lastName}</h1>
          </div>
          <div className="space-y-4 mb-8">
            {['firstName', 'lastName', 'email', 'mobileNumber'].map((field) => (
              <div key={field} className="grid grid-cols-[120px_1fr] items-center">
                <label className="font-bold text-gray-600">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={editedUser[field]}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-800">{user[field]}</span>
                )}
              </div>
            ))}
            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="font-bold text-gray-600">User Type:</label>
              <span className="text-gray-800">{user.userType}</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
            <button
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              onClick={isEditing ? handleUpdateProfile : () => setIsEditing(true)}
            >
              {isEditing ? 'Update Profile' : 'Edit Profile'}
            </button>
            <button
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              onClick={gethoteldata}
            >
              Booking History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}