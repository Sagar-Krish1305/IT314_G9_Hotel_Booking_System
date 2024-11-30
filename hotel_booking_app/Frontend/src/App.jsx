import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from './components/UserContext';
import Navbar from './components/Navbar';
import  Signup  from "./components/Signup";
import Login from "./components/Login";
import  ForgotPassword  from './components/Forgot_Password';
import  ResetPassword  from './components/ResetPassword';
import Profile from './components/Profile';
import Home from './components/Home';
import { PhilippinePeso } from 'lucide-react';
import Cookies from 'js-cookie';
import BookingHistoryPage from './components/HistoryPage';
import HotelSearchPage from './components/HotelSearchPage';
import HotelDetailPage from './components/HotelDetailPage';
import ReviewForm from './components/ReviewForm';
import BookingPage from './components/BookingPage';
import ManagerHotel from './components/ManagerHotel';
import HotelForm from './components/EditHotel';
import AboutUs from './components/About';
// import PPP from './components/PPP';

export default function Component() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // Verify token and set user
            fetch('http://localhost:8000/api/v1/user/verify-token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("App " + data.user);
                    setUser(data.user);
                } else {
                    console.log(data);
                    Cookies.remove('token');
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                Cookies.remove('token');
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ user, setUser}}>
            <Router>
                <Routes>
                    {/* <Route path="/" element={<Navbar />} /> */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<AboutUs/>} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/BookingHistory" element={<BookingHistoryPage/>}/>
                    <Route path="/hotel" element={<HotelSearchPage />} />
                    <Route path="/review/:id" element={<ReviewForm/>}/>
                    <Route path="/booking/:id" element={<BookingPage/>}/>
                    <Route path="/manager/hotel" element={<ManagerHotel/>}/>
                    <Route path="/manager/addhotel" element={<HotelForm/>}/>
                    {/* <Route path="/ppp" element={<PPP />} /> */}
                    <Route 
                        path="/profile" 
                        element={user ? <Profile /> : <Navigate to="/login" />} 
                    />
                    <Route path="/hotel/:id" element={<HotelDetailPage/>} />
                </Routes>
                <ToastContainer />
            </Router>
        </UserContext.Provider>
    );
}