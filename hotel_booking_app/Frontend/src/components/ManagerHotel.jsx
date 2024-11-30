import React, { useState, useEffect } from "react"
import { MapPin, Calendar, Users, Search, Star, Menu } from 'lucide-react'
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';  // Import the Phone icon
import HotelReview from './HotelReview';
import Cookies from "js-cookie"
import { useLocation, useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";


// const navigate = useNavigate();
const Header = ({edit}) => (
    <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-lg font-semibold text-blue-500">StayEasy</h1>
        <div className="flex gap-4">
    
          <button type="button" onClick={edit} className="text-sm p-4 rounded-md bg-blue-500 text-white dark:md:hover:bg-blue-700">Edit hotel Details</button>

        </div>
      </div>
    </header>
  )

const HotelDetailPage = ({ hotel ,rev,edit}) => {
  
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
        <Header edit={edit}/>
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
              <h2 className="text-3xl font-semibold mb-6">Reviews</h2>

              {rev.map((r, index) => (
                  <div className="flex-col mt-3 rounded-sm">
                   <HotelReview key={index} review={r}/>  
                   </div>
                ))
              }
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
  const navigate = useNavigate();

  useEffect(()=>{

        const hotelId = Cookies.get('hotelId');
            const handleHotelClick = async () => {
                try {
                  // Fetch the detailed hotel information
                  const response = await fetch(`http://localhost:8000/api/v1/hotels/${hotelId}`, {
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
                  console.log("shyam",selectedHotel);
                  setReview(data.data.userWiseRatings);
                  console.log(data.data.userWiseRatings[0]);
              
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {selectedHotel ? (
        <HotelDetailPage hotel={selectedHotel}  rev={review} edit={editdata}/>
      ) : (
        <>
          <div>i am shyam</div>
        </>
      )}
    </div>
  )
}