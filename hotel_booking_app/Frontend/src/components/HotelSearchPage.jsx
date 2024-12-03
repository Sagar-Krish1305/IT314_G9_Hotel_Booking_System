import React, { useState, useEffect } from "react"
import { MapPin,ChevronLeft, ChevronRight, Calendar, Users, Search, Star, Menu, ArrowRight  } from 'lucide-react'
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';  // Import the Phone icon
import HotelReview from './HotelReview';
import { useLocation } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar2 from "./Navbar_2";
import config from "../config";
// import { Star, ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react'
// import { HotelDetailPage } from "./HotelDetailPage";
import { FaRupeeSign } from "react-icons/fa";

const Header = () => (
  <header className=" fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
    <div className="container mx-auto flex justify-between items-center py-4 px-6">
      <h1 className=" text-lg font-semibold text-blue-500">StayEasy</h1>
      <div className="flex gap-4">
  
        <button className="text-sm text-gray-600">Sign in</button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Sign up</button>
      </div>
    </div>
  </header>
)

const SearchBar = ({ onSearch ,dataa}) => {
  const [city, setCity] = useState(dataa.location)
  const [checkIn, setCheckIn] = useState(dataa.checkInDate)
  const [checkOut, setCheckOut] = useState(dataa.checkOutDate)
  const [guests, setGuests] = useState(dataa.guests)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch({ city, checkIn, checkOut, guests })
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-4">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="city" className="sr-only">City</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" />
          <input
            id="city"
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="checkIn" className="sr-only">Check-in</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-gray-400" />
          <input
            id="checkIn"
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="checkOut" className="sr-only">Check-out</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-gray-400" />
          <input
            id="checkOut"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={
              checkIn 
                ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1))
                    .toISOString()
                    .split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

                    {/* Guests Counter */}
                    <div className="flex-1 min-w-[150px]">
                <label htmlFor="guests" className="sr-only">Guests</label>
                <div className="relative flex items-center border border-gray-300 rounded py-2 px-3">
                  <Users className="text-gray-400 mr-2" />
                  <button
                    type="button"
                    onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="mx-4 text-md font-medium">{guests} Room{guests > 1 ? 's' : ''}</span>
                  <button
                    type="button"
                    onClick={() => setGuests((prev) => ( prev + 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
        <Search className="inline-block mr-2" />
        Search
      </button>
    </form>
  )
}


export default function HotelSearchPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const location = useLocation();
  const data = location.state?.data;
  const flag = location.state?.flag;

  const ff = {
    city: data.location,
    checkIn: data.checkInDate,
    checkOut: data.checkOutDate,
    guests: data.guests,
  };

  useEffect(() => {
    const handleSearch2 = async () => {
      if (flag) {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ff),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }

          const dataaa = await response.json();
          console.log("s-", dataaa.data);
          setHotels(dataaa.data);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching hotels:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    handleSearch2();
  }, []); 

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      console.log("s-", data.data);
      setHotels(data.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    if (selectedOption === 'low-to-high') {
      setHotels((prevHotels) => [...prevHotels].sort((a, b) => a.hotelData.pricePerNight - b.hotelData.pricePerNight));
    } else if (selectedOption === 'high-to-low') {
      setHotels((prevHotels) => [...prevHotels].sort((a, b) => b.hotelData.pricePerNight - a.hotelData.pricePerNight));
    }
  };

  const navigate = useNavigate();
  const handleHotelClick = (hotel_id) => navigate(`/hotel/${hotel_id}`);

  return (
    <>
      <Navbar2 />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="container mx-auto pt-20">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-6">Find Your Perfect Stay</h1>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-gray-600 mb-2">Sort by:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="mb-2 border border-gray-300 rounded px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} dataa={data} />
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel.hotelData}
                  onClick={() => handleHotelClick(hotel.hotelData._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const HotelCard = ({ hotel, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-white rounded-xl m-4 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col justify-between h-full">
      <div className="relative w-full h-64">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {hotel.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${hotel.hotelName} - Image ${index + 1}`}
              className="flex-shrink-0 w-full h-full object-cover"
            />
          ))}
        </div>
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 focus:outline-none transition-all duration-300"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 focus:outline-none transition-all duration-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="p-6 flex-grow">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{hotel.hotelName}</h3>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <MapPin size={16} className="mr-1" />
          {hotel.address}
        </p>
        <div className="flex items-center mb-2 text-blue-700">
          <FaRupeeSign className="mr-1" />
          {hotel.pricePerNight}
          <span className="text-sm font-normal text-gray-600">/night</span>
        </div>
      </div>
      <div className="p-6 pt-2">
        <button
          onClick={() => onClick(hotel._id)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center font-semibold"
        >
          View Details
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};


