import React from 'react';
// import AboutUsBg from './s.png';
import groupPhoto from '../assets/s.png';

function AboutUs() {
  return (
    <div 
      className="w-full h-full bg-cover bg-center bg-no-repeat py-10 px-5"
    >
      <div className="font-montserrat text-left max-w-3xl mx-auto leading-relaxed text-gray-700 bg-white rounded-lg p-5">
        <h1 className="text-4xl text-[#3556c3] mb-5">About Us</h1>
        <p className="text-lg mb-4">
          Welcome to Hotel Booking! We are committed to providing the best hotel booking experience for travelers.
        </p>
        <p className="text-lg mb-4">
          Our mission is to connect travelers with their perfect accommodation, offering a seamless and secure platform.
        </p>
        <p className="text-lg mb-4">
          Whether you're planning a vacation, a business trip, or a weekend getaway, we've got you covered with the best deals and customer support.
        </p>
        <h2 className="text-2xl text-gray-600 mt-8 mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-5 mb-4">
          <li className="text-base mb-2">Wide selection of hotels and accommodations</li>
          <li className="text-base mb-2">Best price guarantee</li>
          <li className="text-base mb-2">24/7 customer support</li>
          <li className="text-base mb-2">User-friendly booking process</li>
        </ul>

        <div className="mt-10 p-5 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-3xl text-[#007b7b] mb-4">Meet Our Team</h2>
          <div className="grid grid-cols-3 gap-5 mb-5">
            {[
              { name: "Abhinav", id: "202201112" },
              { name: "Praneel Vania", id: "202201131" },
              { name: "Harsh Shah", id: "202201136" },
              { name: "Krish Sagar", id: "202201139" },
              { name: "Divyarajsinh", id: "202201155" },
              { name: "Aman Mangukiya", id: "202201156" },
              { name: "Shyam Ghetiya", id: "202201161" },
              { name: "Tathya Prajapati", id: "202201170" },
              { name: "Malhar Vaghasiya", id: "202201183" },
              { name: "Utsav Kanani", id: "202201184" }
            ].map((member, index) => (
              <div key={index} className="text-center mb-5">
                <h3 className="text-xl text-[#007b7b]">{member.name}</h3>
                <p className="text-base text-gray-600">ID: {member.id}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-5">
          <img src={groupPhoto} alt="Our Group" className="max-w-full h-auto rounded-lg shadow-md max-w-lg mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

