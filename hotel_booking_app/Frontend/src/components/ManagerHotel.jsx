import React, { useState, useEffect } from "react"
import { MapPin, Calendar, Users, Search, Star, Menu } from 'lucide-react'
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';  // Import the Phone icon
import HotelReview from './HotelReview';
import Cookies from "js-cookie"
import { useLocation, useNavigate } from "react-router-dom";
import { SiHotelsdotcom } from "react-icons/si";
import { toast } from 'react-toastify';
import config from "../config";
// import { Navigate } from "react-router-dom";


// const navigate = useNavigate();
const Header = ({edit,getBooking,logo}) => (
    <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-2">
            <SiHotelsdotcom className={`text-2xl text-blue-600`} />
            <span className={`text-2xl font-bold text-blue-600`}>
              stayEazy
            </span>
          </div>
        <div className="flex gap-4">
    
          <button type="button" onClick={edit} className="text-sm p-4 rounded-md bg-blue-500 text-white dark:md:hover:bg-blue-700">Edit hotel Details</button>
          <button type="button" onClick={getBooking} className="text-sm p-4 rounded-md bg-blue-500 text-white dark:md:hover:bg-blue-700">Get Bookings</button>
          <button type="button" onClick={logo} className="text-sm p-4 rounded-md bg-blue-500 text-white dark:md:hover:bg-blue-700">Logout</button>
        </div>
      </div>
    </header>
  )

  const renderAverageRating = (label, value) => {
    const percentage = (parseFloat(value) / 5) * 100; // Calculate the fill percentage based on a 5-star scale
  
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold">{label}</span>
          <span className="text-gray-600 font-medium">({value})</span>
        </div>
        <div className="relative mt-2 h-2 w-full bg-gray-300 rounded-full">
          <div
            className="absolute h-2 bg-blue-600 rounded-full"
            style={{ width: `${percentage}%` }} // Adjust the width dynamically
          ></div>
        </div>
      </div>
    );
  };

const HotelDetailPage = ({ hotel ,rev,edit,averagerev,logo,getbooking}) => {
  
  const facilityIcons = {
    "Free Wifi": "📶",
    "AC": "❄",
    "TV": "📺",
    "Power backup": "🔋",
    "Elevator": "🛗",
    "Heater": "🔥",
    "Parking": "🚗",
    "CCTV": "📹"
  };
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header edit={edit} logo={logo} getBooking={getbooking}/>
      <div className="container mx-auto p-4 pt-20">
        <div className="relative w-full h-[35rem] mb-8">
          <img
            src={hotel.images[0]}
            alt={hotel.hotelName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col lg:flex-row mt-8 space-y-8 lg:space-y-0 lg:space-x-8">
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-semibold mb-6">Overview</h2>
            <h3 className="text-2xl font-semibold mb-4">{hotel.hotelName}</h3>
            <p className="text-gray-600 mb-4">
              {hotel.description}
            </p>
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 gap-6">

              {
                hotel.facilities.map((facility, index) => (
                  <div className="flex items-center" key={index}>
                    <span className="mr-3 text-blue-500 text-4xl">
                      {facilityIcons[facility] } {/* Fallback to a default icon if not found */}
                    </span>
                    <span>{facility}</span>
                  </div>
                ))
              }
              </div>
            </div>
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Contact us</h2>
              <div className="grid grid-cols-2 gap-6">

              {
               <span className="mr-3 text-blue-500">
               <Mail className="inline-block mr-2" />
               {hotel.email}{/* Fallback to a default icon if not found */}
                </span>

             
              }

                 {
               <span className="mr-3 text-blue-500">
               <Phone className="inline-block mr-2" />
               {hotel.contactNo}{/* Fallback to a default icon if not found */}
                </span>

             
              }
              </div>
            </div>


            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Average Ratings</h2>
              <h2 className="text-lg font-semibold mb-6">{rev.length} Ratings</h2>
              <div>
                {renderAverageRating('Overall', averagerev?.averageOverallRatings)}
                {renderAverageRating('Cleanliness', averagerev?.averageCleanlinessRatings)}
                {renderAverageRating('Food', averagerev?.averageFoodRatings)}
                {renderAverageRating('Rooms', averagerev?.averageRoomsRatings)}
                {renderAverageRating('Service', averagerev?.averageServiceRatings)}
              </div>
            </div>


            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Reviews</h2>

              {rev.length > 0 ? (rev?.map((r, index) => (
                  <div className="flex-col mt-3 rounded-sm" key={index}>
                    <HotelReview review={r}/>  
                  </div>
                ))) : <h2 className="text-2xl text-gray-500 "><b>No reviews</b></h2>}  
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ManagerHotel() {
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [review, setReview] = useState([])
  const [avgrev, setavgRev] = useState();
  const navigate = useNavigate();

  const hotelId = Cookies.get('hotelId');
  useEffect(()=>{
    
            const handleHotelClick = async () => {
                try {
                  // Fetch the detailed hotel information
                  const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/${hotelId}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
              
                  const data = await response.json();
                  console.log("Detailed hotel data:", data);
              
                  // Set the selected hotel details
                  setSelectedHotel(data.data.hotel);
                  setReview(data.data.userWiseRatings);
                  setavgRev(data.data.allAverageRatings)
              
                  // Update the URL to include the selected hotel's ID
                  // window.history.pushState({}, '', `/hotel/${hotel._id}`);
                } catch (error) {
                  console.error("Error fetching hotel details:", error);
                }
              };
        
        handleHotelClick(); 
  },[])

  const editdata = ()=>{
    console.log(selectedHotel);
    navigate('/manager/addhotel',  { state: { selectedHotel } });
  }

  const getBooking = async () => {
    navigate('/manager/BookingHistory',{state:{hotelId}});
  }

  const logoe=()=>{
    Cookies.remove('hotelId');
    toast.success("Logout successfully");
    navigate('/');
  } 

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {selectedHotel ? (
        <HotelDetailPage hotel={selectedHotel} rev={review} edit={editdata} averagerev={avgrev} logo={logoe} getbooking={getBooking}/>
      ) : (
        <>
          <div>i am shyam</div>
        </>
      )}
    </div>
  )
}