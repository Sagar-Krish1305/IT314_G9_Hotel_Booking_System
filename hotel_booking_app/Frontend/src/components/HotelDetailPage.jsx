
import React, { useState, useEffect, useRef } from "react"
import { MapPin, Calendar, Users, Search, Star, Menu, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import HotelReview from './HotelReview';
import { useLocation } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import { useNavigate , useParams} from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from "./Navbar";
import Navbar2 from "./Navbar_2";
import { toast } from "react-toastify";
import config from "../config";
import { FaLocationDot } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { FaStar } from 'react-icons/fa';

export default function HotelDetailPage () {
    const {id} = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState();
    const [rev, setRev] = useState([]);
    const [avgrev, setavgRev] = useState([]);
    const [checkInDate,setCheckInDate] = useState();
    const [checkOutDate,setCheckOutDate] = useState();
    const [requiredRooms,setrequiredRooms] = useState();
    const [count,setCount]=useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselRef = useRef(null);
      
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
          
          setHotel(data.data.hotel);
          setRev(data.data.userWiseRatings);
          setavgRev(data.data.allAverageRatings);
          console.log("ssssssss- ",data);

        } catch (error) {
          console.error("Error fetching hotel details:", error);
        }
      };
      handleHotelClick();
    },[])
    
    
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (hotel?.images?.length || 1));
      }, 3000); // Change image every 5 seconds

      return () => clearInterval(timer);
    }, [hotel]);
  
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
      if (adults < 20) setAdults(adults + 1);
    };
  
    const handleDecrement = () => {
      if (adults > 1) setAdults(adults - 1);
    };

    ////////////
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
    
    //////////
  
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
                pricePerNight:hotel.pricePerNight,
                hotelName : hotel.hotelName
            }
            if(!(count >= 2)){
                toast.error("All field is required while booking");
            }else{
                navigate(`/booking/${id}`,{state : {payload}});
            }
        }
    }
    const [adults, setAdults] = useState(1);
  
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar2 />
        <div className="container mx-auto p-4 pt-20">
          <button onClick={()=>navigate(-1)} className="mb-4 text-blue-500 hover:underline">&larr; Back to Search</button>
          <div className="relative w-full h-[35rem] mb-8 overflow-hidden">
            {hotel?.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hotel?.hotelName} - Image ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="flex flex-col lg:flex-row mt-8 space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="w-full lg:w-2/3">
              <h2 className="text-3xl font-semibold mb-4">{hotel?.hotelName}</h2>
              <p className="text-gray-600 mb-4 flex">
                <FaLocationDot className="text-blue-500	mt-1 mr-2"/> {hotel?.address}
              </p>
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
                        {facilityIcons[facility] }
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
                  <span className="mr-3 text-blue-500">
                    <Mail className="inline-block mr-2" />
                    {hotel?.email}
                  </span>
                  <span className="mr-3 text-blue-500">
                    <Phone className="inline-block mr-2" />
                    {hotel?.contactNo}
                  </span>
                </div>
              </div>
              

              <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Average Ratings</h2>
              <h2 className="text-lg font-semibold mb-6">{rev.length} Ratings</h2>
              <div>
                {renderAverageRating('Overall', avgrev?.averageOverallRatings)}
                {renderAverageRating('Cleanliness', avgrev?.averageCleanlinessRatings)}
                {renderAverageRating('Food', avgrev?.averageFoodRatings)}
                {renderAverageRating('Rooms', avgrev?.averageRoomsRatings)}
                {renderAverageRating('Service', avgrev?.averageServiceRatings)}
              </div>
            </div>


              <div className="mb-12">
                <h2 className=" flex text-3xl font-semibold mb-6">Reviews
                  <div className="ml-96 text-xl">
                    <button onClick={handleReview} className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200  font-semibold">
                      Write a Review 
                    </button>
                  </div>
                </h2>
                {rev.length > 0 ? (rev?.map((r, index) => (
                  <div className="flex-col mt-3 rounded-sm" key={index}>
                    <HotelReview review={r}/>  
                  </div>
                ))) : <h2 className="text-2xl text-gray-500 "><b>No reviews</b></h2>}  
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-semibold mb-6 text-blue-600">Book Your Stay</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block flex text-sm font-medium text-blue-700 mb-1">Price Per Night :  <FaRupeeSign className="mt-1"/>{hotel?.pricePerNight}</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                            setCheckInDate(e.target.value);
                            setCount(count+1);
                        }}
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
                        }}
                        min={
                          checkInDate 
                            ? new Date(new Date(checkInDate).setDate(new Date(checkInDate).getDate() + 1))
                                .toISOString()
                                .split("T")[0]
                            : new Date().toISOString().split("T")[0]
                        }
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
