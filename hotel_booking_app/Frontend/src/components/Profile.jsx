import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) {
    return <div className="text-center mt-8">Please log in to view your profile.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/v1/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedUser)
      });

      const data = await response.json();

      if (data.success) {
        setUser(editedUser);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 bg-purple-700 text-white text-2xl font-bold flex justify-center items-center rounded-full mr-6">
          {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
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
                className="border rounded px-2 py-1"
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
          className="flex-1 py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors duration-300"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
        {isEditing ? (
          <button 
            className="flex-1 py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors duration-300"
            onClick={handleUpdateProfile}
          >
            Update Profile
          </button>
        ) : (
          <button 
            className="flex-1 py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors duration-300"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}