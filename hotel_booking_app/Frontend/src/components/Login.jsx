import React, { useState, useContext, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer", // Default to customer
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function changeHandler(event) {
    const { name, value } = event.target;
    if (name === "email") {
      setEmailError(!emailRegex.test(value));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (emailError || !emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }
    const { email, password, userType } = formData;
    try {
      const res = await fetch("/api/v1/createlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType }),
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        toast.success("Login Successful");
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/');
      } else if (res.status === 400 && data.message === "User not registered") {
        toast.error("User not registered");
      } else if (res.status === 400 && data.message === "Incorrect password") {
        toast.error("Incorrect password");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error connecting to the server");
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
      return script;
    };

    const script = loadGoogleScript();
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  function initializeGoogleSignIn() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "312868104346-5s6cqltb36i50uckprvsfrcv130n1mmf.apps.googleusercontent.com",
        callback: handleGoogleSignIn
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: 350 }
      );
    }
  }

  const handleGoogleSignIn = async (response) => {
    try {
      const res = await fetch('/api/v1/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Google Sign-In Successful");
        localStorage.setItem('token', data.token); // Store the token
        setUser(data.user);
        navigate('/');
      } else {
        toast.error(data.message || "Google Sign-In failed");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred during Google Sign-In");
    }
  };

  return (
    <>
      <div className='text-2xl font-bold flex justify-center items-center w-[435px] h-[50px] mt-[30px] mb-[10px] mx-auto border-3 border-black rounded-[10px]'>Login to your Account</div>
      <div className="w-full max-w-[400px] mx-auto p-5 bg-white shadow-md rounded-lg">
        <form method="POST" onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-base text-gray-700 mb-2">
              Email Address<sup className="text-red-500">*</sup>
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={formData.email}
              onChange={changeHandler}
              name="email"
              className={`w-full h-10 px-3 py-2 text-sm border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {emailError && <span className="text-red-500 text-sm">Email is not valid</span>}
          </div>
          <div className="relative">
            <label className="block text-base text-gray-700 mb-2">
              Password<sup className="text-red-500">*</sup>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter Password"
              onChange={changeHandler}
              value={formData.password}
              name="password"
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-2xl text-gray-400" />
              ) : (
                <AiOutlineEye className="text-2xl text-gray-400" />
              )}
            </span>
          </div>
          <div>
            <label className="block text-base text-gray-700 mb-2">
              Sign in as<sup className="text-red-500">*</sup>
            </label>
            <div className="flex justify-between">
              {['admin', 'customer', 'manager'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: type }))}
                  className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors duration-300 ${
                    formData.userType === type
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <a href='/forgot-password' className="block text-red-500 mb-4">Forgot Password</a>
          <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white text-xl py-2 px-4 rounded-md transition-colors duration-300">
            Login
          </button>
        </form>
        <div className="mt-5 flex justify-center">
          <div id="googleSignInDiv"></div>
        </div>
      </div>
    </>
  );
}