import React, { useState, useEffect } from "react"
import { MapPin, Calendar, Users, Search, Star, Menu } from 'lucide-react'

const Header = () => (
  <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
    <div className="container mx-auto flex justify-between items-center py-4 px-6">
      <h1 className="text-lg font-semibold text-blue-500">TripFinder</h1>
      <div className="flex gap-4">
        <button className="text-sm text-gray-600">Hotels</button>
        <button className="text-sm text-gray-600">Listing</button>
        <button className="text-sm text-gray-600">Agent</button>
        <button className="text-sm text-gray-600">Pricing</button>
        <button className="text-sm text-gray-600">Sign in</button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Sign up</button>
      </div>
    </div>
  </header>
)

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)

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


const HotelDetailPage = ({ hotel, onBack }) => {
  const [roomDetails, setRoomDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4 pt-20">
        <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">&larr; Back to Search</button>
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
              Located in {hotel.address}, this 4-star hotel offers a luxurious stay with breathtaking views.
              Enjoy world-class amenities and exceptional service during your visit.
            </p>
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <span className="mr-3 text-blue-500">📶</span>
                  <span>Free High-Speed Wi-Fi</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-blue-500">🏊</span>
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-blue-500">☕</span>
                  <span>24/7 Room Service</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-blue-500">📺</span>
                  <span>Flat-screen TV</span>
                </div>
              </div>
            </div>
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Reviews</h2>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold mr-2">{hotel.ratings}</span>
                <div className="flex">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({hotel.reviews} reviews)</span>
              </div>
              <p className="text-gray-600">
                Guests love the prime location, exceptional service, and luxurious amenities offered by {hotel.hotelName}.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-blue-600">Book Your Stay</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                    </select>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-6 font-semibold">
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


export default function HotelSearchPage() {
  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const handleSearch = async (searchParams) => {
    setLoading(true)
    setError(null)


    try {
      const response = await fetch('http://localhost:8000/api/v1/hotels/search', {
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


  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel)
    window.history.pushState({}, '', `/hotel/${hotel._id}`)
  }


  const handleBackToSearch = () => {
    setSelectedHotel(null)
    window.history.pushState({}, '', '/')
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {selectedHotel ? (
        <HotelDetailPage hotel={selectedHotel} onBack={handleBackToSearch} />
      ) : (
        <>
          <Header />
          <div className="container mx-auto pt-20">
            <h1 className="text-3xl font-bold mb-6">Find Your Perfect Stay</h1>
            <SearchBar onSearch={handleSearch} />
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} onClick={handleHotelClick} />
                ))}
              </div>
            )}
            {hotels.length > 0 && (
              <div className="flex justify-center mt-8">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                  Load More
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}


const HotelCard = ({ hotel, onClick }) => (
  <div
    className="bg-white p-3 rounded shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:scale-105 cursor-pointer"
    onClick={() => onClick(hotel)}
  >
    <img
      src={hotel.images[0]}
      alt={hotel.hotelName}
      className="w-full h-32 object-cover rounded mb-3"
    />
    <p className="text-gray-500 text-xs mb-1">{hotel.address}</p>
    <h3 className="font-semibold text-base mb-1">{hotel.hotelName}</h3>
    <p className="text-gray-600 text-xs mb-1">${hotel.pricePerNight}/Night</p>
    <div className="flex items-center text-xs">
      <span className="text-yellow-500 mr-1">
        {"★".repeat(4)}
        {"☆".repeat(1)}
      </span>
      <span className="text-gray-500">{hotel.ratings} Hi, shyam!</span>
    </div>
  </div>
)




