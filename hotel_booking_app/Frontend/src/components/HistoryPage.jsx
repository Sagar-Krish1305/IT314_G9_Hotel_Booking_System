import React, { useState } from 'react'
import { CalendarDays, Users, CreditCard, Mail, User, Building, MapPin } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Navbar2 from './Navbar_2'

const BookingHistoryCard = ({
  hotelName,
  checkInDate,
  checkOutDate,
  roomsBooked,
  pricePerNight,
  totalPayment,
  email,
  firstName,
  lastName,
  hotelPhotoUrl
}) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden flex flex-col sm:flex-row h-[275px] transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-200/50 hover:transform hover:scale-[1.02]">
      <div className="sm:w-2/5 md:w-1/3 h-full">
        <img
          src={hotelPhotoUrl}
          alt={`${hotelName} photo`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{hotelName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-600">Check-in</p>
                <p className="text-sm text-gray-800">{checkInDate.slice(0, 10)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-600">Check-out</p>
                <p className="text-sm text-gray-800">{checkOutDate.slice(0, 10)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-600">Rooms Booked</p>
                <p className="text-sm text-gray-800">{roomsBooked}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-600">Price per Night</p>
                <p className="text-sm text-gray-800">₹{pricePerNight.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-600">Total Payment</p>
                <p className="text-sm text-gray-800">₹{totalPayment.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-600">Guest Name</p>
                <p className="text-sm text-gray-800">{`${firstName} ${lastName}`}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Mail className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Email</p>
              <p className="text-sm text-gray-800">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingHistoryPage() {

    const location = useLocation();
    const bookingHistory = location.state?.dataa; 
    console.log("hi     ",bookingHistory);

  return (
    <>
    <Navbar2/>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mt-10 font-bold mb-6">Your Booking History</h1>
      <div className="space-y-8">
        {bookingHistory.map((data, index) => (
          <BookingHistoryCard key={index} {...data} />
        ))}
      </div>
    </div>
    </>
  )
}