import React, { useState, useEffect, useRef} from 'react'
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'; 
import Navbar from './Navbar'
import Footer from './Footer';
import { MapPin,ChevronLeft, ChevronRight, Calendar, Users, Search, Star, Menu, ArrowRight  } from 'lucide-react'
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import config from '../config';


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

  return(
    <div className="bg-white rounded-xl m-4 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
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
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{hotel.hotelName}</h3>
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <MapPin size={16} className="mr-1" />
          {hotel.address}
        </p>
        <div className="flex  items-center mb-4 text-blue-700">
          {/* <p className="text-2xl font-bold text-blue-600 flex"> */}
                <FaRupeeSign classname="bg-blue-700"/> {hotel.pricePerNight}
            <span className="text-sm font-normal text-gray-600">/night</span>
        </div>
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
}  




export default function Home() {

  const [hotels,setHotels] = useState([]);
 
  const handleHotelClick = (hotel_id) => navigate(`/hotel/${hotel_id}`);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2049&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ]

  useEffect(()=>{
    const gethoteldata = async () => {
      // const token = Cookies.get('token');
      try {
        const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/getRandomHotels`, {
          method: 'GET',
        })
  
        if (response.ok) {
          const data = await response.json()
          // setHotelData(data);
          console.log("sssssss3333" , data);
          setHotels(data.data);
          // navigate('/BookingHistory' , {state: {dataa:data.data}});
        } else {
          console.error('Failed to fetch hotel data')
          toast.error('Failed to fetch hotel data')
        }
      } catch (error) {
        console.error('Error fetching hoteldata:', error)
        toast.error('Error fetching hoteldata')
      }
    }
    gethoteldata()
  },[])

  const [isScrolled, setIsScrolled] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [favoriteHotels, setFavoriteHotels] = useState([])
    const scrollContainerRef = useRef(null)
    const navigate  = useNavigate();
   
  
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
      }, 5000)
      return () => clearInterval(timer)
    }, [])
  
    const toggleFavorite = (hotelId) => {
      setFavoriteHotels((prevFavorites) => {
        if (prevFavorites.includes(hotelId)) {
          return prevFavorites.filter((id) => id !== hotelId)
        } else {
          return [...prevFavorites, hotelId]
        }
      })
    }

    const scrollHotels = (direction) => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = container.offsetWidth
      container.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const [location, setLocation] = useState(''); // Location state
  const [checkInDate, setCheckInDate] = useState(''); // Check-in date state
  const [checkOutDate, setCheckOutDate] = useState(''); // Check-out date state
  const [guests, setGuests] = useState(1); // Guest count state
  const [myData, setMyData] = useState({}); // State to hold submitted form data

  // Handle increment
  const increment = () => {
    setGuests(prevGuests => prevGuests + 1);
  };

  // Handle decrement
  const decrement = () => {
    if (guests > 1) {
      setGuests(prevGuests => prevGuests - 1);
    }
  };

  // Handle form submission
  const changedata = (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    const data = {
      location,
      checkInDate,
      checkOutDate,
      guests
    };

    // Update myData state with the form data
    setMyData(data);
    console.log('Form Data:', data); // You can check the data here or send it to an API
    const flag=true;
    navigate("/hotel", { state: { data , flag } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isScrolled={isScrolled} />

      <div className="relative h-screen">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg text-white text-center mb-8 max-w-2xl">
            Discover and book your ideal accommodations from our vast selection of hotels worldwide.
          </p>
          <form onSubmit={changedata}>
      <div className="w-full max-w-4xl p-6 bg-white/90 backdrop-blur-md rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">📍</span>
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={location} // Controlled input
              onChange={(e) => setLocation(e.target.value)} // Update location on change
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">📅</span>
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={checkInDate} // Controlled input
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckInDate(e.target.value)} // Update checkInDate on change
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">📅</span>
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={checkOutDate} // Controlled input
              min={
                checkInDate 
                  ? new Date(new Date(checkInDate).setDate(new Date(checkInDate).getDate() + 1))
                      .toISOString()
                      .split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              onChange={(e) => setCheckOutDate(e.target.value)} // Update checkOutDate on change
            />
          </div>
          <div className="flex items-center space-x-4">
            {/* Title */}
            <span className="text-md font-semibold text-gray-700">Rooms:</span>

            {/* Increment/Decrement Buttons */}
            <button
              onClick={decrement}
              type="button" // Prevent form submission
              className="w-10 h-10 flex items-center justify-center bg-blue-400 text-gray-600 rounded-full hover:bg-blue-600 transition duration-200"
            >
              -
            </button>

            <span className="text-lg font-medium text-gray-700">{guests}</span>

            <button
              onClick={increment}
              type="button" // Prevent form submission
              className="w-10 h-10 flex items-center justify-center bg-blue-400 text-gray-600 rounded-full hover:bg-blue-600 transition duration-200"
            >
              +
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="mr-2">🔍</span>
          Search Hotels
        </button>
      </div>
    </form>
        </div>
      </div>
 

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Featured Luxury Hotels</h2>
          {/* <Link to="/luxury-hotels" className="text-blue-600 hover:underline">
            View all
          </Link> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} onClick={()=>handleHotelClick(hotel._id)} />
                ))}
              </div>
      </div>
      <Footer/>
    </div>
  )
}