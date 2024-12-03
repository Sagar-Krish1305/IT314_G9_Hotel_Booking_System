import React, { useState } from 'react';
import config from '../config';
import { toast } from 'react-toastify';

const HotelField = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    )}
  </div>
);

const HotelForm2 = () => {
  const [hotelData, setHotelData] = useState({
    hotelName: '',
    city: '',
    country: '',
    address: '',
    description: '',
    roomCount: '',
    facilities: [],
    pricePerNight: '',
    contactNo: '',
    email: '',
    password: '',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setHotelData((prevData) => ({
        ...prevData,
        facilities: checked
          ? [...prevData.facilities, value]
          : prevData.facilities.filter((facility) => facility !== value),
      }));
    } else if (type === 'file') {
      setHotelData((prevData) => ({
        ...prevData,
        images: Array.from(files),
      }));
    } else {
      setHotelData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(hotelData).forEach((key) => {
      if (key === 'facilities') {
        formData.append(key, JSON.stringify(hotelData[key])); // Handle array data
      } else if (key === 'images') {
        hotelData[key].forEach((file) => {
          formData.append('images', file); // Append each file under 'images'
        });
      } else {
        formData.append(key, hotelData[key]); // Append other text fields
      }
    });
    
    
    // Log FormData content (for debugging purposes)
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    
    try {
      const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/hotelRegister`, {
        method: 'POST',
        body: formData, // Convert the hotelData object to JSON
      });
      

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      if (result.statusCode === 200) {
        toast.success('Hotel Register successfully!');
        setHotelData({
          hotelName: '',
          city: '',
          country: '',
          address: '',
          description: '',
          roomCount: '',
          facilities: [],
          pricePerNight: '',
          contactNo: '',
          email: '',
          password: '',
          images: [],
        });
      } else {
        toast.error('Failed to Register hotel');
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      toast.error('Failed to Register hotel');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full p-8 bg-white bg-opacity-90 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Hotel Details Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <HotelField label="Hotel Name" name="hotelName" value={hotelData.hotelName} onChange={handleChange} required />
          <HotelField label="City" name="city" value={hotelData.city} onChange={handleChange} required />
          <HotelField label="Country" name="country" value={hotelData.country} onChange={handleChange} required />
          <HotelField label="Address" name="address" value={hotelData.address} onChange={handleChange} required />
          <HotelField label="Description" name="description" value={hotelData.description} onChange={handleChange} type="textarea" />
          <HotelField label="Room Count" name="roomCount" value={hotelData.roomCount} onChange={handleChange} type="number" required min="1" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-8 mt-3">
              {['Free Wifi', 'AC', 'TV', 'Power backup', 'Elevator', 'Heater', 'Parking', 'CCTV'].map((facility) => (
                <label key={facility} className="text-gray-700 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="facilities"
                    value={facility}
                    checked={hotelData.facilities.includes(facility)}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <HotelField label="Price Per Night" name="pricePerNight" value={hotelData.pricePerNight} onChange={handleChange} type="number" required />
          <HotelField label="Contact Number" name="contactNo" value={hotelData.contactNo} onChange={handleChange} required />
          <HotelField label="Email" name="email" value={hotelData.email} onChange={handleChange} type="email" required />
          <HotelField label="Password" name="password" value={hotelData.password} onChange={handleChange} type="password" required />

          <div>
            <label className="block text-lg font-semibold mb-2">Hotel Photos (Optional)</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {hotelData.images.map((photo, index) => (
                <span key={index} className="text-sm text-blue-500 underline">
                  {photo.name}
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelForm2;