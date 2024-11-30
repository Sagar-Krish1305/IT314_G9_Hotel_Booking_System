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

const Header = () => (
  <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
    <div className="container mx-auto flex justify-between items-center py-4 px-6">
      <h1 className="text-lg font-semibold text-blue-500">StayEasy</h1>
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="guests" className="sr-only">Guests</label>
        <div className="relative">
          <Users className="absolute left-3 top-3 text-gray-400" />
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
        <Search className="inline-block mr-2" />
        Search
      </button>
    </form>
  )
}




// const HotelDetailPage = ({ hotel, onBack ,rev}) => {
//   const [roomDetails, setRoomDetails] = useState({
//     checkIn: '',
//     checkOut: '',
//     guests: 1,
//     x: 1,
//     totalPrice: 0,
//   })

//   const [adults, setAdults] = useState(1);

//   const navigate = useNavigate();
//   const handleReview = () =>{
//       navigate("/review");
//   }

//   const handleIncrement = () => {
//     if (adults < 20) setAdults(adults + 1); // Limit to a maximum of 4
//   };

//   const handleDecrement = () => {
//     if (adults > 1) setAdults(adults - 1); // Limit to a minimum of 1
//   };

//   const facilityIcons = {
//     "Free Wifi": "📶",
//     "AC": "❄",
//     "TV": "📺",
//     "Power backup": "🔋",
//     "Elevator": "🛗",
//     "Heater": "🔥",
//     "Parking": "🚗",
//     "CCTV": "📹"
//   };
//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [])

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <div className="container mx-auto p-4 pt-20">
//         <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">&larr; Back to Search</button>
//         <div className="relative w-full h-[35rem] mb-8">
//           <img
//             src={hotel.images[0]}
//             alt={hotel.hotelName}
//             className="w-full h-full object-cover rounded-lg"
//           />
//         </div>
//         <div className="flex flex-col lg:flex-row mt-8 space-y-8 lg:space-y-0 lg:space-x-8">
//           <div className="w-full lg:w-2/3">
//             <h2 className="text-3xl font-semibold mb-6">Overview</h2>
//             <h3 className="text-2xl font-semibold mb-4">{hotel.hotelName}</h3>
//             <p className="text-gray-600 mb-4">
//               {hotel.description}
//             </p>
//             <div className="mb-12">
//               <h2 className="text-3xl font-semibold mb-6">Amenities</h2>
//               <div className="grid grid-cols-2 gap-6">

//               {
//                 hotel.facilities.map((facility, index) => (
//                   <div className="flex items-center" key={index}>
//                     <span className="mr-3 text-blue-500 text-4xl">
//                       {facilityIcons[facility] } {/* Fallback to a default icon if not found */}
//                     </span>
//                     <span>{facility}</span>
//                   </div>
//                 ))
//               }
//               </div>
//             </div>
//             <div className="mb-12">
//               <h2 className="text-3xl font-semibold mb-6">Contact us</h2>
//               <div className="grid grid-cols-2 gap-6">

//               {
//                <span className="mr-3 text-blue-500">
//                <Mail className="inline-block mr-2" />
//                {hotel.email}{/* Fallback to a default icon if not found */}
//                 </span>

             
//               }

//                  {
//                <span className="mr-3 text-blue-500">
//                <Phone className="inline-block mr-2" />
//                {hotel.contactNo}{/* Fallback to a default icon if not found */}
//                 </span>

             
//               }


//               </div>
//             </div>
//             <div>
              
//             </div>
//             <div className="mb-12">
//               <h2 className=" flex text-3xl font-semibold mb-6">Reviews
//                 <div className="ml-96 text-xl">
//                 <button onClick={handleReview} className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200  font-semibold">

//                           Write a Review 

//                           </button>
//                </div>
//               </h2>
               
//               {rev.map((r, index) => (
//                   <div className="flex-col mt-3 rounded-sm">
//                    <HotelReview key={index} review={r}/>  
//                    </div>
//                 ))
//               }
              
//             </div>
//           </div>
//           <div className="w-full lg:w-1/3">
//             <div className="sticky top-24">
//               <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
//                 <h3 className="text-2xl font-semibold mb-6 text-blue-600">Book Your Stay</h3>
                      
                
//                 <div className="space-y-4">

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night :  ${hotel.pricePerNight}</label>
                   
//                   </div>


//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
//                     <input 
//                       type="date" 
                      
//                       min={new Date().toISOString().split("T")[0]} // Current date

//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
//                     <input 
//                       type="date" 
//                       min={new Date().toISOString().split("T")[0]} 
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
//                     <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
//                       <button
//                         onClick={handleDecrement}
//                         className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         disabled={adults === 1}
//                       >
//                         -
//                       </button>
//                       <span className="flex-1 text-center">{adults} Room{adults > 1 ? "s" : ""}</span>
//                       <button
//                         onClick={handleIncrement}
//                         className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         disabled={adults === 20}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <button  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-6 font-semibold">
//                   Book Now
//                 </button>
//                 <p className="text-sm text-gray-500 mt-4 text-center">
//                   Best price guarantee. No booking fees.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default function HotelSearchPage() {
  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [review, setReview] = useState([])
  const location = useLocation();
  const data = location.state?.data; 
  const flag = location.state?.flag;
  const ff = {
    city : data.location,
    checkIn : data.checkInDate,
    checkOut : data.checkOutDate,
    guests : data.guests
  }

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
    setLoading(true)
    setError(null)


    try {
      const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      })


      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }


      const data = await response.json()
      console.log("s-",data.data)
      setHotels(data.data)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching hotels:", err)
    } finally {
      setLoading(false)
    }
  }

  



    const navigate = useNavigate();
    const handleHotelClick = (hotel_id) => navigate(`/hotel/${hotel_id}`);

  
  


  const handleBackToSearch = () => {
    setSelectedHotel(null)
    window.history.pushState({}, '', '/')
  }


  return (
    <>
    <Navbar2/>
        <div className="min-h-screen bg-gray-100 p-4">
      {/* {selectedHotel ? (
        <HotelDetailPage hotel={selectedHotel} onBack={handleBackToSearch} rev={review}/>
      ) : ( */}
        <>
          <div className="container mx-auto pt-20">
            <h1 className="text-3xl font-bold mb-6">Find Your Perfect Stay</h1>
            <SearchBar onSearch={handleSearch} dataa={data}/>
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel.hotelData} onClick={()=>handleHotelClick(hotel.hotelData._id)} />
                ))}
              </div>
            )}
          </div>
        </>
      {/* )} */}
    </div>
    </>
    
  )
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
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-blue-600">
            ${hotel.pricePerNight}
            <span className="text-sm font-normal text-gray-600">/night</span>
          </p>
          {/* <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
            <Star className="text-yellow-500 mr-1" size={16} />
            <span className="text-sm font-semibold text-blue-800">{hotel.ratings.toFixed(1)}</span>
          </div> */}
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



