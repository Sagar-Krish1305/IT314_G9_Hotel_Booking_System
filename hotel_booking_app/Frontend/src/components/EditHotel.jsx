import React, { useState } from 'react';
import HotelField from './HotelField';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const HotelForm = () => {
  
const location = useLocation();
const filledData = location.state?.selectedHotel;

  const [hotelData, setHotelData] = useState({
    hotelName: filledData.hotelName,
    city: filledData.city,
    country: filledData.country,
    address: filledData.address,
    description: filledData.description,
    roomCount: filledData.roomCount,
    facilities: filledData.facilities, // Array to store selected facilities
    pricePerNight: filledData.pricePerNight,
    contactNo: filledData.contactNo,
    email: filledData.email,
    password: '',
    images: [], // For image files
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkboxes for facilities
    if (type === 'checkbox') {
      setHotelData((prevData) => ({
        ...prevData,
        facilities: checked
          ? [...prevData.facilities, value]
          : prevData.facilities.filter((facility) => facility !== value),
      }));
    } else {
      setHotelData({ ...hotelData, [name]: value });
    }
  };

  const handleInputFiles = (e) => {
    const { files } = e.target;
    setHotelData({
      ...hotelData,
      images: Array.from(files),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Create a FormData object
    const formData = new FormData();
    console.log(hotelData);
    // Append hotelData to the formData
    Object.keys(hotelData).forEach((key) => {
      if (key !== 'images') {
        formData.append(key, hotelData[key]);
      }
    });

    // Append images to the FormData object
    hotelData.images.forEach((file) => formData.append('images', file));

    try {
      // console.log("shyam- ",formData);

      console.log("shyam",hotelData);
      const response = await axios.post('http://localhost:8000/api/v1/manager/edit-hotel-details',hotelData);
      console.log(response);
    console.log('afdasdfas',response.data.data.hotel);
    console.log(response.data.data.success);

// try {
//   const result = await axios.post(`${config.BACKEND_API}/api/user/signup`, data, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       "authorization": "Bearer " + localStorage.getItem("token")
//     }
//   });
      if (response.data.data?.success) {
        alert('Hotel data submitted successfully!');
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
        console.error('Error submitting hotel data');
      }
    } catch (error) {
      console.error('Error:', error);
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
          {/* Hotel Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Hotel Information</h3>
            <HotelField label="Hotel Name" name="hotelName" value={hotelData.hotelName} onChange={handleChange} required />
            <HotelField label="City" name="city" value={hotelData.city} onChange={handleChange} required />
            <HotelField label="Country" name="country" value={hotelData.country} onChange={handleChange} required />
            <HotelField label="Address" name="address" value={hotelData.address} onChange={handleChange} required />
            <HotelField label="Description" name="description" value={hotelData.description} onChange={handleChange} type="textarea" />
            <HotelField label="Room Count" name="roomCount" value={hotelData.roomCount} onChange={handleChange} type="number" required min="1" />

            {/* Facilities Section with Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Facilities</h3>

              {/* Grid layout for checkboxes */}
              <div className="grid grid-cols-4 gap-y-3 gap-x-8 mt-3">
                {['Free Wifi', 'AC', 'TV', 'Power backup', 'Elevator', 'Heater', 'Parking', 'CCTV'].map((facility) => (
                  <label key={facility} className="text-gray-700 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={facility}
                      checked={hotelData.facilities.includes(facility)}
                      onChange={handleChange}
                    />
                    <span>{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            <HotelField label="Price Per Night" name="pricePerNight" value={hotelData.pricePerNight} onChange={handleChange} type="number" required />
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
            <HotelField label="Contact Number" name="contactNo" value={hotelData.contactNo} onChange={handleChange} required />
            <HotelField label="Email" name="email" value={hotelData.email} onChange={handleChange} type="email" required />
          </div>

          {/* Credentials Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Credentials</h3>
            <HotelField label="Password" name="password" value={hotelData.password} onChange={handleChange} type="password" required />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-lg font-semibold mb-2">Do you have photos to share? (Optional)</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleInputFiles}
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

          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelForm;