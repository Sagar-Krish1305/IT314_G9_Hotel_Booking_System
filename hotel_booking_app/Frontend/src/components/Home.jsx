import { useState, useEffect, useRef } from 'react'
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const HotelCard = ({ hotel, isFavorite, onToggleFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const imageContainerRef = useRef(null)

  const scrollImages = (direction) => {
    const container = imageContainerRef.current
    if (container) {
      const scrollAmount = container.offsetWidth
      container.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    const container = imageContainerRef.current
    if (container) {
      const index = Math.round(container.scrollLeft / container.offsetWidth)
      setCurrentImageIndex(index)
    }
  }

  useEffect(() => {
    const container = imageContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex-shrink-0 relative" 
      style={{ scrollSnapAlign: 'start', width: 'calc(33.333% - 1rem)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 group">
        <div
          ref={imageContainerRef}
          className="flex overflow-x-auto scrollbar-hide h-full"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {hotel.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${hotel.name} - Image ${index + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            />
          ))}
        </div>
        <button
          className="absolute top-2 right-2 text-white hover:text-red-500 bg-transparent border-none"
          onClick={() => onToggleFavorite(hotel.id)}
        >
          {isFavorite ? (
            <FaHeart className="text-2xl text-red-500" />
          ) : (
            <FaRegHeart className="text-2xl" />
          )}
        </button>
        <button
          onClick={() => scrollImages('prev')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-full shadow-md z-10 hover:bg-white/80 opacity-0 group-hover:opacity-45 transition-opacity duration-300"
        >
          <FaChevronLeft className="text-gray-800" />
        </button>
        <button
          onClick={() => scrollImages('next')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-full shadow-md z-10 hover:bg-white/80 opacity-0 group-hover:opacity-45 transition-opacity duration-300"
        >
          <FaChevronRight className="text-gray-800" />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {hotel.images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{hotel.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{hotel.address}</p>
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-lg ${i < hotel.rating ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </span>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            ({hotel.reviews} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-blue-600">${hotel.price}<span className="text-sm font-normal text-gray-500">/night</span></p>
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
            Book Now
          </button>
        </div>
      </div>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-2 transform transition-transform duration-300 ease-in-out flex justify-between items-center"
        style={{ transform: isHovered ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="flex flex-col">
          <p className="font-bold text-blue-600">${hotel.price}<span className="text-sm font-normal text-gray-500">/night</span></p>
          <Link 
            to={`/details/${hotel.id}`}
            className="flex items-center gap-2 text-[#2F8B99] hover:underline mt-1"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Details</span>
          </Link>
        </div>
        <button className="px-2 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors duration-300">
          Book Now
        </button>
      </div>
    </div>
  )
}
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [favoriteHotels, setFavoriteHotels] = useState([])
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const toggleFavorite = (hotelId) => {
    setFavoriteHotels((prevFavorites) => {
      if (prevFavorites.includes(hotelId)) {
        return prevFavorites.filter((id) => id !== hotelId)
      } else {
        return [...prevFavorites, hotelId]
      }
    })
  }

  const backgroundImages = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2049&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ]

  const luxuryHotels = [
    {
      id: 1,
      name: "Luxury Resort & Spa",
      address: "Maldives, South Asia",
      price: 550,
      rating: 5,
      reviews: 128,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80"
      ]
    },
    {
      id: 2,
      name: "Grand Hotel Palace",
      address: "Paris, France",
      price: 420,
      rating: 4,
      reviews: 96,
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80"
      ]
    },
    {
      id: 3,
      name: "Seaside Retreat",
      address: "Bali, Indonesia",
      price: 380,
      rating: 5,
      reviews: 112,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2049&q=80"
      ]
    },
    {
      id: 4,
      name: "Mountain View Lodge",
      address: "Swiss Alps, Switzerland",
      price: 490,
      rating: 4,
      reviews: 86,
      images: [
        "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
      ]
    },
    {
      id: 5,
      name: "Urban Oasis Hotel",
      address: "New York City, USA",
      price: 600,
      rating: 5,
      reviews: 154,
      images: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ]
    }
  ]

  const destinations = [
    {
      city: "Paris",
      country: "France",
      hotels: 1520,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
    },
    {
      city: "London",
      country: "United Kingdom",
      hotels: 2150,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      city: "New York",
      country: "United States",
      hotels: 1840,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      city: "Tokyo",
      country: "Japan",
      hotels: 1650,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1971&q=80"
    },
    {
      city: "Dubai",
      country: "United Arab Emirates",
      hotels: 980,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ]

  const scrollHotels = (direction) => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = container.offsetWidth
      container.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                🏨 BestLikeHome
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/hotels" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-blue-500`}>Hotels</Link>
            <Link to="/flights" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-blue-500`}>Flights</Link>
            <Link to="/tours" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-blue-500`}>Tours</Link>
            <Link to="/cars" className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-blue-500`}>Cars</Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign in</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign up</button>
          </div>
          <button className="md:hidden bg-transparent border-none p-2">
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
          </button>
        </div>
      </nav>

      <div className="relative h-screen">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg text-white text-center mb-8 max-w-2xl">
            Discover and book your ideal accommodations from our vast selection of hotels worldwide.
          </p>
          
          <div className="w-full max-w-4xl p-6 bg-white/90 backdrop-blur-md rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">📍</span>
                <input type="text" placeholder="Where are you going?" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">📅</span>
                <input type="date" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">📅</span>
                <input type="date" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">👥</span>
                <select className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none">
                  <option value="">Guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center">
              <span className="mr-2">🔍</span>
              Search Hotels
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Featured Luxury Hotels</h2>
          <Link to="/luxury-hotels" className="text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        
        <div className="relative group">
          <button
            onClick={() => scrollHotels('prev')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-full shadow-md z-10 hover:bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronLeft className="text-gray-800" />
          </button>
          <button
            onClick={() => scrollHotels('next')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-full shadow-md z-10 hover:bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronRight className="text-gray-800" />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {luxuryHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                isFavorite={favoriteHotels.includes(hotel.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Popular Destinations</h2>
            <Link to="/destinations" className="text-blue-600 hover:underline">
              View all destinations
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {destinations.map((destination) => (
              <Link
                key={destination.city}
                to={`/destinations/${destination.city.toLowerCase()}`}
                className="relative h-64 rounded-lg overflow-hidden group"
              >
                <img
                  src={destination.image}
                  alt={destination.city}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-60" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{destination.city}</h3>
                  <p className="text-sm">{destination.country}</p>
                  <p className="text-sm mt-1">{destination.hotels} hotels</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}