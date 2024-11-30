import React, { useState, useContext, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import Cookies from 'js-cookie';
import immm from "./s.png";
import Navbar from "./Navbar";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    hotelId: "",
    password: "",
    userType: "customer",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hotelIdRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    if (formData.userType === "customer" && (emailError || !emailRegex.test(formData.email))) {
      toast.error("Invalid email format");
      return;
    }
    if (formData.userType === "manager" && !hotelIdRegex.test(formData.hotelId)) {
      toast.error("Invalid hotel ID format");
      return;
    }
    const { email, hotelId, password, userType } = formData;
    try {
      const endpoint = userType === "customer" ? "http://localhost:8000/api/v1/user/createlogin" : "http://localhost:8000/api/v1/manager/login";
      const payload = userType === "customer" ? { email, password } : { email:hotelId, password };
      console.log(endpoint);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        toast.success("Login Successful");
        Cookies.set("token", data.token, { expires: 7 });
        
        if (userType === "customer") {
          Cookies.set("firstname", data.user.firstName, { expires: 7 });
          Cookies.set("lastname", data.user.lastName, { expires: 7 });
          Cookies.set("email", data.user.email, { expires: 7 });
          Cookies.set("mobileno", data.user.mobileNumber, { expires: 7 });
          setUser(data.user);
          navigate("/home");
        } else {
          Cookies.set("hotelId", data.hotel.id, { expires: 7 });
          setUser(data.user);
          navigate(`/manager/hotel`);
        }
      } else if (res.status === 400 && data.message === (userType === "customer" ? "User not registered" : "Hotel not registered")) {
        toast.error(userType === "customer" ? "User not registered" : "Hotel not registered");
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
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
      return script;
    };

    if (formData.userType === "customer") {
      const script = loadGoogleScript();
      return () => {
        if (script) {
          document.body.removeChild(script);
        }
      };
    }
  }, [formData.userType]);

  function initializeGoogleSignIn() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "312868104346-5s6cqltb36i50uckprvsfrcv130n1mmf.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: 350 }
      );
    }
  }

  const handleGoogleSignIn = async (response) => {
    try {
      console.log(response);
      const res = await fetch("http://localhost:8000/api/v1/user/google-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Login Successful");
        Cookies.set("token", data.token, { expires: 7 });
        Cookies.set("firstname", data.user.firstName, { expires: 7 });
        Cookies.set("lastname", data.user.lastName, { expires: 7 });
        Cookies.set("email", data.user.email, { expires: 7 });
        Cookies.set("mobileno", data.user.mobileNumber, { expires: 7 });
        setUser(data.user);
        navigate("/home");
      } else {
        toast.error(data.message || "Google Sign-In failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during Google Sign-In");
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white flex flex-col justify-center items-center">
            <img
              src={immm}
              alt="Login illustration"
              className="mb-8 rounded-2xl h-[300]"
            />
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-blue-100 text-center">Sign in to access your account and enjoy our services</p>
          </div>
          
          <div className="md:w-1/2 p-12">
            <div className="max-w-sm mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h3>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sign in as
                  </label>
                  <div className="flex space-x-4">
                    {["customer", "manager"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, userType: type }))}
                        className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors duration-300 ${
                          formData.userType === type
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.userType === "customer" ? (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={changeHandler}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        emailError ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {emailError && <span className="text-red-500 text-sm">Email is not valid</span>}
                  </div>
                ) : (
                  <div>
                    <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700 mb-1">
                      Hotel ID
                    </label>
                    <input
                      type="text"
                      id="hotelId"
                      name="hotelId"
                      required
                      placeholder="Enter your hotel ID"
                      value={formData.hotelId}
                      onChange={changeHandler}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-gray-400"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-2xl" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>
              
              {formData.userType === "customer" && (
                <>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div id="googleSignInDiv" className="flex justify-center"></div>
                    </div>
                  </div>
                  
                </>
              )}

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                   Sign up
                </a>
           </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}