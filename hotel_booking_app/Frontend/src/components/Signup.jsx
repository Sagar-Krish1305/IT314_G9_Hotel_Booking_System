import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import immm from "./s.png";

export default function Signup() {
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    // userType: "customer",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;

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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  async function postdata_into_database(e) {
    e.preventDefault();
    if (emailError || !emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!mobileRegex.test(formData.mobileNumber)) {
      toast.error("Invalid mobile number format");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!validatePassword(formData.password)) {
      toast.error(
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long'
      );
      return;
    }

    const { firstName, lastName, email, mobileNumber, password, confirmPassword, userType } = formData;

    try {
      const res = await fetch("/api/v1/createmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          e_mail: email,
          mobile_number: mobileNumber,
          password: password,
          confirm_password: confirmPassword,
          // user_type: userType,
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        toast.success("Account Created Successfully");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          password: "",
          confirmPassword: "",
          // userType: "customer",
        });
        navigate('/login');
      } else if (res.status === 400 && data.message === "User with this email already exists") {
        toast.error("User already exists with this email");
      } else if (res.status === 400 && data.message === "Password and confirm password do not match") {
        toast.error("Password and Confirm Password do not match");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error connecting to the server");
      console.error("Error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white flex flex-col justify-center items-center">
            <img
              src={immm}
              alt="Hotel check-in illustration"
              className="mb-8 rounded-2xl h-[300]"
            />
            <h2 className="text-3xl font-bold mb-4">Welcome</h2>
            <p className="text-blue-100 text-center">Sign up to create your account and enjoy our services</p>
          </div>
          
          <div className="md:w-1/2 p-12">
            <div className="max-w-sm mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sign Up</h3>
              
              <form onSubmit={postdata_into_database} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
                    className={`w-full px-4 py-2 rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {emailError && <span className="text-red-500 text-sm">Email is not valid</span>}
                  {emailExists && <span className="text-red-500 text-sm">User already exists with this email</span>}
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaPhone className="text-gray-400" />
                    </span>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      required
                      placeholder="Enter Mobile Number"
                      value={formData.mobileNumber}
                      onChange={changeHandler}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type={showCreatePass ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePass(!showCreatePass)}
                    className="absolute right-3 top-8 text-gray-400"
                  >
                    {showCreatePass ? (
                      <AiOutlineEyeInvisible className="text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-2xl" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-8 text-gray-400"
                  >
                    {showConfirmPass ? (
                      <AiOutlineEyeInvisible className="text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-2xl" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Register
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}