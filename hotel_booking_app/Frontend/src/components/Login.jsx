import React, { useState, useEffect } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { toast } from 'react-toastify'
import immm from "./s.png"

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    hotelId: "",
    userType: "customer",
  })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function changeHandler(event) {
    const { name, value } = event.target
    if (name === "email") {
      setEmailError(!emailRegex.test(value))
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (formData.userType === 'customer' && (emailError || !emailRegex.test(formData.email))) {
      toast.error("Invalid email format")
      return
    }
    const { email, password, userType, hotelId } = formData
    try {
      const res = await fetch("/api/v1/createlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType, hotelId }),
      })
      const data = await res.json()
      if (res.status === 200 && data.success) {
        toast.success("Login Successful")
        localStorage.setItem('token', data.token)
        // Assuming you're using Next.js
        window.location.href = '/'
      } else if (res.status === 400 && data.message === "User not registered") {
        toast.error("User not registered")
      } else if (res.status === 400 && data.message === "Incorrect password") {
        toast.error("Incorrect password")
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      toast.error("Error connecting to the server")
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.body.appendChild(script)
      return script
    }

    if (formData.userType === 'customer') {
      const script = loadGoogleScript()
      return () => {
        if (script) {
          document.body.removeChild(script)
        }
      }
    }
  }, [formData.userType])

  function initializeGoogleSignIn() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "312868104346-5s6cqltb36i50uckprvsfrcv130n1mmf.apps.googleusercontent.com",
        callback: handleGoogleSignIn
      })
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: 350 }
      )
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
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Google Sign-In Successful")
        localStorage.setItem('token', data.token)
        // Assuming you're using Next.js
        window.location.href = '/'
      } else {
        toast.error(data.message || "Google Sign-In failed")
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error("An error occurred during Google Sign-In")
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
              className="mb-8 rounded-2xl h-[300px] w-[300px]"
            />
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-blue-100 text-center">Sign in to access your account and enjoy our services</p>
          </div>

          <div className="md:w-1/2 p-12">
            <div className="max-w-sm mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h3>

              <form onSubmit={handleLogin} className="space-y-6">
                {formData.userType === 'customer' ? (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={changeHandler}
                      className={`w-full px-4 py-2 rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your email"
                      required
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
                      value={formData.hotelId}
                      onChange={changeHandler}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your Hotel ID"
                      required
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
                    value={formData.password}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sign in as
                  </label>
                  <div className="flex justify-between space-x-2">
                    {['customer', 'manager'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, userType: type }))}
                        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors duration-300 ${
                          formData.userType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />
                    <span className="text-gray-700">Remember me</span>
                  </label>
                  <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>

              {formData.userType === 'customer' && (
                <div className="mt-6 text-center">
                  <div id="googleSignInDiv" className="inline-block"></div>
                </div>
              )}

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don&apos;t have an account? </span>
                <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}