import React, { useState, useEffect } from "react"
import { MapPin, Calendar, Users, Search, Star, Menu } from 'lucide-react'
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';  // Import the Phone icon
import HotelReview from './HotelReview';
import { useLocation } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import { useNavigate , useParams} from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from "./Navbar";
import Navbar2 from "./Navbar_2";
import { toast } from "react-toastify";
import config from "../config";


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


export default function HotelDetailPage () {
    const {id} = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState();
    const [rev, setRev] = useState();
    const [checkInDate,setCheckInDate] = useState();
    const [checkOutDate,setCheckOutDate] = useState();
    const [requiredRooms,setrequiredRooms] = useState();
    const [count,setCount]=useState(0);

    useEffect(()=>{ console.log("id", id) },[id]);

    useEffect(()=>{

  const handleHotelClick = async () => {
    try {
      // Fetch the detailed hotel information
      const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/${id}`, {
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
      
    //   Cookies.set('hotelId',data.data.hotel._id);
      // Cookies.set('review',data.data.userWiseRatings);
      // Set the selected hotel details
      setHotel(data.data.hotel);
      console.log("shyam",data.data.hotel);
      setRev(data.data.userWiseRatings);
      console.log(data.data.userWiseRatings[0]);

    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }
  };
    handleHotelClick();
    },[])

    // const [roomDetails, setRoomDetails] = useState({
    //   checkIn: '',
    //   checkOut: '',
    //   guests: 1,
    //   x: 1,
    //   totalPrice: 0,
    // })
  
    const [adults, setAdults] = useState(1);
  
    const handleReview = () =>{
        const flag = Cookies.get('token');

        if(typeof flag==="undefined"){
            console.log("inside");
            navigate("/login");
        }else{
            navigate(`/review/${id}`);
        }    
    }
  
    const handleIncrement = () => {
      if (adults < 20) setAdults(adults + 1); // Limit to a maximum of 4
    };
  
    const handleDecrement = () => {
      if (adults > 1) setAdults(adults - 1); // Limit to a minimum of 1
    };
  
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

    const handlebooking=()=>{

        const flag = Cookies.get('token');

        if(typeof flag==="undefined"){
            console.log("inside");
            navigate("/login");
        }
        else{

            const payload ={
                checkInDate,
                checkOutDate,
                requiredRooms : adults,
                pricePerNight:hotel.pricePerNight
            }
            
            console.log(count);
            if(!(count >= 2)){
                toast.error("All field is required while booking");
            }else{
            // console.log(payload);
            // console.log(typeof(checkInDate));
            navigate(`/booking/${id}`,{state : {payload}});
            }
        }
        
    }
  
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar2 />
        <div className="container mx-auto p-4 pt-20">
          <button onClick={()=>navigate(-1)} className="mb-4 text-blue-500 hover:underline">&larr; Back to Search</button>
          <div className="relative w-full h-[35rem] mb-8">
            <img
              src={hotel?.images[0]}
              alt={hotel?.hotelName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col lg:flex-row mt-8 space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="w-full lg:w-2/3">
              <h2 className="text-3xl font-semibold mb-6">Overview</h2>
              <h3 className="text-2xl font-semibold mb-4">{hotel?.hotelName}</h3>
              <p className="text-gray-600 mb-4">
                {hotel?.description}
              </p>
              <div className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">Amenities</h2>
                <div className="grid grid-cols-2 gap-6">
  
                {
                  hotel?.facilities?.map((facility, index) => (
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
                 {hotel?.email}{/* Fallback to a default icon if not found */}
                  </span>
  
               
                }
  
                   {
                 <span className="mr-3 text-blue-500">
                 <Phone className="inline-block mr-2" />
                 {hotel?.contactNo}{/* Fallback to a default icon if not found */}
                  </span>
  
               
                }
  
  
                </div>
              </div>
              <div>
                
              </div>
              <div className="mb-12">
                <h2 className=" flex text-3xl font-semibold mb-6">Reviews
                  <div className="ml-96 text-xl">
                  <button onClick={handleReview} className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200  font-semibold">
  
                            Write a Review 
  
                            </button>
                 </div>
                </h2>
                 
                {rev?.map((r, index) => (
                    <div className="flex-col mt-3 rounded-sm">
                     <HotelReview key={index} review={r}/>  
                     </div>
                  ))
                }
                
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-semibold mb-6 text-blue-600">Book Your Stay</h3>
                        
                  
                  <div className="space-y-4">
  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night :  ${hotel?.pricePerNight}</label>
                     
                    </div>
  
  
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                      <input 
                        type="date" 
                        
                        min={new Date().toISOString().split("T")[0]} // Current date
                        onChange={(e) => {
                            setCheckInDate(e.target.value);
                            setCount(count+1);
                        }
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                      <input 
                        type="date" 
                        onChange={(e) => {
                            setCheckOutDate(e.target.value);
                            setCount(count+1);
                        }
                        }
                        min={new Date().toISOString().split("T")[0]} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                      <div className="flex items-center w-full border border-gray-300 rounded-md px-3 py-2">
                        <button
                          onClick={handleDecrement}
                          className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={adults === 1}
                        >
                          -
                        </button>
                        <span className="flex-1 text-center">{adults} Room{adults > 1 ? "s" : ""}</span>
                        <button
                          onClick={handleIncrement}
                          className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={adults === 20}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={handlebooking} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-6 font-semibold">
                    Book Now
                  </button>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Best price guarantee. No booking fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }