import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export const Signup = () => {
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
    userType: "customer", // Default to customer
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
      // const hashedPassword = await bcrypt.hash(password, 10);

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
          user_type: userType,
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
          userType: "customer",
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
    <>
      <div className='text-2xl font-bold flex justify-center items-center w-[435px] h-[50px] mt-[30px] mb-[10px] mx-auto border-3 border-black rounded-[10px]'>Sign Up for the Register</div>
      <div className="w-full max-w-[400px] mx-auto p-5 bg-white shadow-md rounded-lg">
        <form method="POST" onSubmit={postdata_into_database} className="space-y-4">
          <div>
            <label className="block text-base text-gray-700 mb-2">
              First Name<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              required
              placeholder="Enter First Name"
              onChange={changeHandler}
              value={formData.firstName}
              name="firstName"
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-base text-gray-700 mb-2">
              Last Name<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              required
              placeholder="Enter Last Name"
              onChange={changeHandler}
              value={formData.lastName}
              name="lastName"
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
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
            {emailExists && <span className="text-red-500 text-sm">User already exists with this email</span>}
          </div>
          <div>
            <label className="block text-base text-gray-700 mb-2">
              Mobile Number<sup className="text-red-500">*</sup>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaPhone className="text-gray-400" />
              </span>
              <input
                type="tel"
                required
                placeholder="Enter Mobile Number"
                onChange={changeHandler}
                value={formData.mobileNumber}
                name="mobileNumber"
                className="w-full h-10 pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-base text-gray-700 mb-2">
              Create Password<sup className="text-red-500">*</sup>
            </label>
            <input
              type={showCreatePass ? "text" : "password"}
              required
              placeholder="Enter Password"
              onChange={changeHandler}
              value={formData.password}
              name="password"
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
            <span
              onClick={() => setShowCreatePass(!showCreatePass)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showCreatePass ? (
                <AiOutlineEyeInvisible className="text-2xl text-gray-400" />
              ) : (
                <AiOutlineEye className="text-2xl text-gray-400" />
              )}
            </span>
          </div>
          <div className="relative">
            <label className="block text-base text-gray-700 mb-2">
              Confirm Password<sup className="text-red-500">*</sup>
            </label>
            <input
              type={showConfirmPass ? "text" : "password"}
              required
              placeholder="Confirm Password"
              onChange={changeHandler}
              value={formData.confirmPassword}
              name="confirmPassword"
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showConfirmPass ? (
                <AiOutlineEyeInvisible className="text-2xl text-gray-400" />
              ) : (
                <AiOutlineEye className="text-2xl text-gray-400" />
              )}
            </span>
          </div>
          <div>
            <label className="block text-base text-gray-700 mb-2">
              Register as<sup className="text-red-500">*</sup>
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
          <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white text-xl py-2 px-4 rounded-md transition-colors duration-300">
            Register
          </button>
          <button type="button" className="w-full mt-2 bg-purple-700 hover:bg-purple-800 text-white text-xl py-2 px-4 rounded-md transition-colors duration-300">
            <a href='/login' className="text-white no-underline">Login</a>
          </button>
        </form>
      </div>
    </>
  );
};