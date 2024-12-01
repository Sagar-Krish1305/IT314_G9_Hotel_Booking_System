import React, { useState, useEffect } from 'react';
import { Building2, Users, Star, Clock, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import a from '../assets/1.jpeg'
import b from '../assets/2.jpeg'
import c from '../assets/3.jpeg'
import d from '../assets/4.jpeg'
import e from '../assets/5.jpeg'
import f from '../assets/6.jpeg'
import g from '../assets/7.jpeg'
import h from '../assets/8.jpeg'
import i from '../assets/9.jpg'
import j from '../assets/10.jpeg'

// List of developer profiles
const developers = [ 
  { name: "Abhinav", role: "202201112", image: a },
  { name: "Praneel Vania", role: "202201131", image: b },
  { name: "Harsh Shah", role: "202201136", image: c },
  { name: "Krish Sagar", role: "202201139", image: d },
  { name: "Divyarajsinh", role: "202201155", image: e },
  { name: "Aman Mangukiya", role: "202201156", image: f },
  { name: "Shyam Ghetiya", role: "202201161", image: g },
  { name: "Tathya Prajapati", role: "202201170", image: h },
  { name: "Malhar Vaghasiya", role: "202201183", image: i },
  { name: "Utsav Kanani", role: "202201184", image: j },
];


/**
 * AboutUs Component
 * This component represents the "About Us" page of the StayEase website.
 */
function AboutUs() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically rotate the developer profiles every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 3 >= developers.length ? 0 : prevIndex + 3
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle the previous button click
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? developers.length - 3 : prevIndex - 3
    );
  };

  // Handle the next button click
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= developers.length ? 0 : prevIndex + 3
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] text-[#1e3a8a]">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-b from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="z-10 text-center text-white">
          <h1 className="text-3xl font-bold mb-4">About BestLikeHome</h1>
          <p className="text-l">Revolutionizing the Way You Book Hotels</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid ml-5 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-[#1e3a8a]">Our Mission</h2>
            <p className="text-[#334155] leading-relaxed mb-6">
              At BestLikeHome, we're committed to transforming the hotel booking experience through innovative technology and exceptional service. 
              Our platform combines cutting-edge features with user-friendly design to make finding and booking the perfect accommodation effortless.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Building2 className="text-[#3b82f6]" />
                <span className="text-[#334155]">500+ Hotels</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-[#3b82f6]" />
                <span className="text-[#334155]">10k+ Users</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="text-[#3b82f6]" />
                <span className="text-[#334155]">4.9 Rating</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-[#3b82f6]" />
                <span className="text-[#334155]">24/7 Support</span>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] mr-5">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury hotel lobby" 
              className="rounded-lg object-cover h-full w-full shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
<div className="bg-white py-14">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-2xl font-semibold mb-10 text-center text-[#1e3a8a]">Our Developers</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {developers.slice(0, 10).map((dev, index) => (
       <div
       key={index}
       className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-105 shadow-lg border border-[#e5e7eb]"
       style={{ height: '350px' }} // Height for the entire card
     >
       <div className="mt-10 flex justify-center items-center h-[200px] w-[200px] mx-auto"> {/* Ensures a square container */}
         <img
           src={dev.image}
           alt={dev.name}
           className="w-[200px] h-[200px] object-cover rounded-full" // Ensures perfect circle
         />
       </div>
       <div className="p-4 text-center">
         <h3 className="text-lg font-semibold mb-1 text-[#1e3a8a]">{dev.name}</h3>
         <p className="text-sm text-[#3b82f6]">{dev.role}</p>
       </div>
     </div>
     
     
      ))}
    </div>
  </div>
</div>





      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-12 text-center text-[#1e3a8a]">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-[#e5e7eb]">
            <h3 className="text-l font-semibold mb-4 text-[#1e3a8a]">Innovation</h3>
            <p className="text-[#334155]">Continuously pushing boundaries to deliver cutting-edge solutions in hotel booking technology.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border border-[#e5e7eb]">
            <h3 className="text-l font-semibold mb-4 text-[#1e3a8a]">User-Centric</h3>
            <p className="text-[#334155]">Putting our users first with intuitive design and seamless booking experiences.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border border-[#e5e7eb]">
            <h3 className="text-l font-semibold mb-4 text-[#1e3a8a]">Excellence</h3>
            <p className="text-[#334155]">Striving for perfection in every aspect of our service and technical implementation.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-center text-[#1e3a8a]">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Mail className="text-[#3b82f6] mt-1" />
                <div>
                  <h3 className="text-l font-semibold text-[#1e3a8a] mb-2">Email Us</h3>
                  <p className="text-[#334155]">support@stayease.com</p>
                  <p className="text-[#334155]">business@stayease.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-[#3b82f6] mt-1" />
                <div>
                  <h3 className="text-l font-semibold text-[#1e3a8a] mb-2">Call Us</h3>
                  <p className="text-[#334155]">+1 (555) 123-4567</p>
                  <p className="text-[#334155]">+1 (555) 987-6543</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-[#3b82f6] mt-1" />
                <div>
                  <h3 className="text-l font-semibold text-[#1e3a8a] mb-2">Visit Us</h3>
                  <p className="text-[#334155]">123 Tech Hub Street</p>
                  <p className="text-[#334155]">Silicon Valley, CA 94025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
