import React, { useState, useEffect } from 'react'
import { CalendarDays, Users, CreditCard, Mail, User } from 'lucide-react'
import Navbar2 from './Navbar_2'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import config from '../config'

const BookingHistoryCard = ({
  bookingId,
  hotelId,
  hotelName,
  checkInDate,
  checkOutDate,
  roomsBooked,
  pricePerNight,
  totalPayment,
  email,
  firstName,
  lastName,
  hotelPhotoUrl,
  onCancel
}) => {
  const navigate = useNavigate();
  
  const isWithin24Hours = () => {
    const checkIn = new Date(checkInDate)
    const now = new Date()
    const timeDiff = checkIn.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)
    return hoursDiff <= 24
  }
  const viewHotel = () => {
    console.log("hotelId", hotelId);
    navigate(`/hotel/${hotelId}`);
  }

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden flex flex-col sm:flex-row h-[300px] transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-200/50 hover:transform hover:scale-[1.02]">
      <div className="sm:w-2/5 md:w-1/3 h-full">
        <img
          src={hotelPhotoUrl}
          alt={`${hotelName} photo`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{hotelName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
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
        
        <div className="mt-2">
          <div className="flex items-center">
            <Mail className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Email</p>
              <p className="text-sm text-gray-800">{email}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={() => onCancel(bookingId)}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ease-in-out ${
              isWithin24Hours() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'
            }`}
            disabled={isWithin24Hours()}
          >
            {isWithin24Hours() ? 'Cannot Cancel' : 'Cancel Booking'}
          </button>
          <button 
            onClick={viewHotel}
            className="px-4 py-2 rounded-md font-medium transition-colors duration-200 ease-in-out bg-blue-600 text-white hover:bg-blue-700"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BookingHistoryPage() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const initialBookings = location.state?.dataa || [];
    const cancelledBookings = JSON.parse(Cookies.get('cancelledBookings') || '[]');
    const filteredBookings = initialBookings.filter(booking => !cancelledBookings.includes(booking.bookingId));
    setBookings(filteredBookings);
  }, [location.state]);

  const handleCancelBooking = async (bookingId) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) {
      toast.error('Booking not found');
      return;
    }

    const checkInDate = new Date(booking.checkInDate);
    const now = new Date();
    const timeDiff = checkInDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff <= 24) {
      toast.error('Cancellation is not allowed within 24 hours of check-in');
      return;
    }

    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/${bookingId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          // Remove the cancelled booking from the state
          setBookings(prevBookings => prevBookings.filter(booking => booking.bookingId !== bookingId));
          
          // Add the cancelled booking ID to local storage
          const cancelledBookings = JSON.parse(Cookies.get('cancelledBookings') || '[]');
          cancelledBookings.push(bookingId);
          Cookies.set('cancelledBookings', JSON.stringify(cancelledBookings));
          
          toast.success('Booking cancelled successfully');
        } else {
          toast.error('Failed to cancel booking');
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('An error occurred while cancelling the booking');
      }
    }
  }

  return (
    <>
      <Navbar2 />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mt-10 font-bold mb-6">Your Booking History</h1>
        <div className="space-y-8">
          {bookings.map((booking, index) => (
            <BookingHistoryCard
              key={index}
              {...booking}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      </div>
    </>
  )
}
