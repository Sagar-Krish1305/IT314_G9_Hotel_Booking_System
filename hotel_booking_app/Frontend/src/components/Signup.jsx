import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify'; // Include ToastContainer in your main component
import './Signup.css';

export const Signup = () => {
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  // Password Validation Function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle form submission
  async function postdata_into_database(e) {
    e.preventDefault();

    // Check if email format is valid
    if (emailError || !emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength
    if (!validatePassword(formData.password)) {
      toast.error(
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long'
      );
      return;
    }

    // Send data to backend to check if email exists and create the account
    const { firstName, lastName, email, password, confirmPassword } = formData;

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
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.status === 200 && data.success) {
        toast.success("Account Created Successfully");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else if (res.status === 400 && data.message === "User with this email already exists") {
        toast.error("User already exists with this email");
      } else if (res.status === 400 && data.message === "Password and confirm password do not match") {
        toast.error("Password and Confirm Password do not match");
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
      <div className='heading'>Sign Up for the Register</div>
      <div className="signup-container">
        <form method="POST" onSubmit={postdata_into_database}>
          <div className="form-group">
            <label className="form-label">
              👤 First Name <sup className="required">*</sup>
            </label>
            <input
              type="text"
              required
              placeholder="Enter First Name"
              onChange={changeHandler}
              value={formData.firstName}
              name="firstName"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
            👤 Last Name <sup className="required">*</sup>
            </label>
            <input
              type="text"
              required
              placeholder="Enter Last Name"
              onChange={changeHandler}
              value={formData.lastName}
              name="lastName"
              className="form-input"
            />
          </div>

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
            {emailError && <span className="error-text"><sup className="required">*</sup>Email is not valid</span>}
            {emailExists && <span className="error-text">User already exists with this email</span>}
          </div>

          <div className="form-group password-group">
            <label className="form-label">
              🔐 Create Password <sup className="required">*</sup>
            </label>
            <input
              type={showCreatePass ? "text" : "password"}
              required
              placeholder="Enter Password"
              onChange={changeHandler}
              value={formData.password}
              name="password"
              className="form-input"
            />
            <span
              onClick={() => setShowCreatePass(!showCreatePass)}
              className="password-toggle"
            >
              {showCreatePass ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </div>

          <div className="form-group password-group">
            <label className="form-label">
              🔐 Confirm Password <sup className="required">*</sup>
            </label>
            <input
              type={showConfirmPass ? "text" : "password"}
              required
              placeholder="Confirm Password"
              onChange={changeHandler}
              value={formData.confirmPassword}
              name="confirmPassword"
              className="form-input"
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="password-toggle"
            >
              {showConfirmPass ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </div>

          <button type="submit" className="submit-button">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
};
