import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify'; // Include ToastContainer in your main component
import './Login.css';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for validating email format

  function changeHandler(event) {
    const { name, value } = event.target;

    // Validate email format as the user types
    if (name === "email") {
      setEmailError(!emailRegex.test(value));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle form submission
  async function handleLogin(e) {
    e.preventDefault();

    // Check if email format is valid
    if (emailError || !emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    // Send data to backend to check if user exists and validate password
    const { email, password } = formData;

    try {
      const res = await fetch("/api/v1/createlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 200 && data.success) {
        toast.success("Login Successful");
      } else if (res.status === 400 && data.message === "User not registered") {
        toast.error("User not registered");
      } else if (res.status === 400 && data.message === "Incorrect password") {
        toast.error("Incorrect password");
      } else {
        toast.error("Something went wrong");
      }

    } catch (error) {
      toast.error("Error connecting to the server");
      console.error("Error: ", error);
    }
  }

  return (
    <>
      <div className='heading'>Login to your Account</div>
      <div className="login-container">
        <form method="POST" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">
              📧 Email Address <sup className="required">*</sup>
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={formData.email}
              onChange={changeHandler}
              name="email"
              className={`form-input ${emailError ? "error" : ""}`}
            />
            {emailError && <span className="error-text">Email is not valid</span>}
          </div>

          <div className="form-group password-group">
            <label className="form-label">
              🔐 Password <sup className="required">*</sup>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter Password"
              onChange={changeHandler}
              value={formData.password}
              name="password"
              className="form-input"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
      </div>
    </>
  );
};
