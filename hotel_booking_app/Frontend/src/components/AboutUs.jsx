import React from 'react';
import './AboutUs.css';
import AboutUsBg from '../assets/aboutus-bg.jpg';  
import groupPhoto from '../assets/group-photo.jpg';

function AboutUs() {
  return (
    <div 
      className="about-us-background" 
      style={{ backgroundImage: `url(${AboutUsBg})` }}
    >
      <div className="about-us-container">
        <h1>About Us</h1>
        <p>
          Welcome to Hotel Booking! We are committed to providing the best hotel booking experience for travelers.
        </p>
        <p>
          Our mission is to connect travelers with their perfect accommodation, offering a seamless and secure platform.
        </p>
        <p>
          Whether you're planning a vacation, a business trip, or a weekend getaway, we've got you covered with the best deals and customer support.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Wide selection of hotels and accommodations</li>
          <li>Best price guarantee</li>
          <li>24/7 customer support</li>
          <li>User-friendly booking process</li>
        </ul>

        <div className="about-group">
          <h2>Meet Our Team</h2>
          <div className="group-members">
            <div className="member">
              <h3>Abhinav</h3>
              <p>ID: 202201112</p>
            </div>
            <div className="member">
              <h3>Praneel Vania</h3>
              <p>ID: 202201131</p>
            </div>
            <div className="member">
              <h3>Harsh Shah</h3>
              <p>ID: 202201136</p>
            </div>
            <div className="member">
              <h3>Krish Sagar</h3>
              <p>ID: 202201139</p>
            </div>
            <div className="member">
              <h3>Divyarajsinh</h3>
              <p>ID: 202201155</p>
            </div>
            <div className="member">
              <h3>Aman Mangukiya</h3>
              <p>ID: 202201156</p>
            </div>
            <div className="member">
              <h3>Shyam Ghetiya</h3>
              <p>ID: 202201161</p>
            </div>
            <div className="member">
              <h3>Tathya Prajapati</h3>
              <p>ID: 202201170</p>
            </div>
            <div className="member">
              <h3>Malhar Vaghasiya</h3>
              <p>ID: 202201183</p>
            </div>
            <div className="member">
              <h3>Utsav Kanani</h3>
              <p>ID: 202201184</p>
            </div>
          </div>
        </div>
        
        <div className="group-photo">
          <img src={groupPhoto} alt="Our Group" />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
