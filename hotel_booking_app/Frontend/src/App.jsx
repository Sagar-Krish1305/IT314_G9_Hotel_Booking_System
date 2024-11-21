import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./components/Signup";
import Login from './components/Login';
import Home from './components/Home';
import ForgotPassword from './components/Forgot_Password';
import ResetPassword from './components/ResetPassword';
// import Profile from './components/Profile';
import { UserContext } from './components/UserContext';
import Cookies from 'js-cookie';
import HotelSearchPage from './components/HotelSearchPage';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingPage from './components/BookingPage';'
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const token = Cookies.get('token');
      if (token) {
          // Verify token and set user
          fetch('/api/v1/verify-token', {
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
                  Cookies.remove('token');
              }
              setLoading(false);
          })
          .catch(err => {
              console.error(err);
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
      <UserContext.Provider value={{ user, setUser }}>
          <Router>
              <div>
                  <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password/:token" element={<ResetPassword />} />
                      <Route 
                          path="/profile" 
                          element={user ? <Profile /> : <Navigate to="/login" />} 
                      />
                      <Route path="/about-us" element={<AboutUs />} />
                      <Route path="/members" element={<Members />} /> 
                  </Routes>
                  <Footer />
                  <ToastContainer />
              </div>
          </Router>
      </UserContext.Provider>
  );
}

export default App;
