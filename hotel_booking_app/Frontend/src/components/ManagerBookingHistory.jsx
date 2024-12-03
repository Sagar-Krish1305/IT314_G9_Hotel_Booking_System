import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, CreditCard, Mail, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import config from '../config';

const BookingDetailsCard = ({
  name,
  email,
  contactNo,
  checkInDate,
  checkOutDate,
  bookedRooms,
  totalCost,
}) => {
  return (
    <div className="w-full bg-blue-50 shadow-md rounded-lg overflow-hidden flex flex-col sm:flex-row h-[300px] transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-200/50 hover:transform hover:scale-[1.02]">
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Booking Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <div className="space-y-3">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-blue-600">Check-in Date</p>
                <p className="text-sm text-blue-800">{checkInDate.slice(0, 10)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-blue-600">Check-out Date</p>
                <p className="text-sm text-blue-800">{checkOutDate.slice(0, 10)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-blue-600">Rooms Booked</p>
                <p className="text-sm text-blue-800">{bookedRooms}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-blue-600">Total Cost</p>
                <p className="text-sm text-blue-800">₹{totalCost.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-blue-600">Email</p>
                <p className="text-sm text-blue-800">{email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs font-medium text-blue-600">Contact Number</p>
                <p className="text-sm text-blue-800">{contactNo}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-blue-600">Guest Name</p>
          <p className="text-lg text-blue-800">{name}</p>
        </div>
      </div>
    </div>
  );
};

export default function ManagerBookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const hotelId = Cookies.get('hotelId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${config.BACKEND_ID}/api/v1/manager/${hotelId}/booking-history`,
          {
            method: 'GET',
          }
        );

        if (response.ok) {
          const result = await response.json();
          setBookings(result.data);
        } else {
          toast.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('An error occurred while fetching bookings');
      }
    };

    fetchBookings();
  }, [hotelId]);

  return (
    <>
      <div className="bg-white-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Back to Hotel Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:underline font-semibold"
          >
            &larr; Back to Hotel
          </button>
          <h1 className="text-3xl font-bold mb-6 text-blue-900">User Bookings</h1>
          <div className="space-y-8">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <BookingDetailsCard key={index} {...booking} />
              ))
            ) : (
              <p className="text-blue-600 text-center">No bookings found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
