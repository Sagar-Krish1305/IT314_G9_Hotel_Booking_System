import React from 'react';
import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie'

const BookingPage = () => {
    const location = useLocation();
    const bookdata = location.state?.payload;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhoneNo] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate();
    
    // Use optional chaining and provide default values
    const checkIn = bookdata?.checkInDate ? new Date(bookdata.checkInDate) : new Date();
    const checkOut = bookdata?.checkOutDate ? new Date(bookdata.checkOutDate) : new Date();
    const stayDuration = Math.max(1, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const baseCost = stayDuration * (bookdata?.pricePerNight || 0) * (bookdata?.requiredRooms || 1);

    const gst = baseCost * 0.18;
    const totalCost = baseCost + gst;

    const {id} = useParams();

    const handleBooking = async (event) => {
        event.preventDefault();
        if (!bookdata) {
            setError("Booking data is missing. Please try again.");
            return;
        }
        setLoading(true);
        setError(null);

        const payload = { 
            firstName, 
            lastName, 
            email, 
            phone, 
            checkInDate: bookdata.checkInDate, 
            checkOutDate: bookdata.checkOutDate, 
            roomCount: bookdata.requiredRooms, 
            totalCost 
        };

        try {
            const token = Cookies.get('token');
            const response = await fetch(`http://localhost:8000/api/v1/hotels/${id}/confirm-booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to confirm booking');
            }

            const data = await response.json();
            console.log('Booking confirmed:', data.data);
            navigate(`/hotel/${id}`);
        } catch (err) {
            setError(err.message);
            console.error('Error confirming booking:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!bookdata) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-xl text-red-500">Error: Booking data is missing. Please go back and try again.</p>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-lg p-3">
                <div className="flex items-center space-x-2">
                    <img src="https://img.freepik.com/premium-vector/hotel-booking-logo-design_675581-44.jpg?w=1060" alt="TripFinder Logo" className="h-6 w-6" />
                    <span className="text-blue-500 text-lg font-semibold">TripFinder</span>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row justify-center p-4 lg:p-10 space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="lg:w-2/3 xl:w-1/2 bg-white p-5 shadow-lg rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Enter your details</h2>
                    <p className="text-xs text-gray-600 mb-4">
                        We will use these details to share your booking information
                    </p>

                    <form className="space-y-3">
                        <div>
                            <label className="text-xs font-medium">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Check-In-Date</label>
                            <input
                                type="date"
                                value={bookdata.checkInDate}
                                readOnly
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Check-Out-Date</label>
                            <input
                                type="date"
                                value={bookdata.checkOutDate}
                                readOnly
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Rooms</label>
                            <input
                                type="text"
                                value={bookdata.requiredRooms}
                                readOnly
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@abc.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Mobile Number</label>
                            <div className="flex">
                                <span className="p-2 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">+91</span>
                                <input
                                    type="text"
                                    placeholder="e.g. 1234567890"
                                    value={phone}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-r-lg focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="lg:w-1/3 xl:w-1/4 bg-white p-5 shadow-lg rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold">Hotel O Relax Inn</h2>
                        <span className="text-xs bg-blue-500 text-white rounded-md px-1 py-0.5">NEW</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{`${stayDuration} - Night${stayDuration > 1 ? 's' : ''}`}</p>
                    <div className="flex items-center mb-3">
                        <span className="text-xs text-gray-500">{`${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}`}</span>
                        <span className="mx-1">|</span>
                        <span className="text-xs text-gray-500">{`${bookdata.requiredRooms} - Room${bookdata.requiredRooms > 1 ? 's' : ''}`}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mb-3">
                        <h3 className="text-base font-semibold mb-1">Classic</h3>
                        <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>Room price</span>
                            <span>{`₹${baseCost.toFixed(2)}`}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>18% GST</span>
                            <span>{`₹${gst.toFixed(2)}`}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>Instant discount</span>
                            <span>-₹0.00</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                        <span className="text-base font-semibold">Payable Amount</span>
                        <span className="text-base font-semibold">{`₹${totalCost.toFixed(2)}`}</span>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-xs font-medium mb-2">Choose payment method to pay</h4>
                        <div className="flex items-center gap-3">
                            <button className="flex-1 py-2 px-4 bg-gray-200 rounded-lg text-gray-600 font-medium text-sm">Pay At Hotel</button>
                            <button className="flex-1 py-2 px-4 bg-gray-200 rounded-lg text-gray-600 font-medium text-sm">Pay Now</button>
                        </div>
                        <button 
                            className="w-full mt-3 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm" 
                            onClick={handleBooking}
                            disabled={loading}
                        >
                            {loading ? 'Booking...' : 'Book Now'}
                        </button>
                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;