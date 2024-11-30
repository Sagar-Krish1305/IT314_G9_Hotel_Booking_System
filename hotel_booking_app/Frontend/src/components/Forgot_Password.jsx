import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';
import immm from "../assets/s.png"

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    function changeHandler(event) {
        setEmail(event.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${config.BACKEND_ID}/api/v1/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.success('Password reset email sent. Please check your inbox.');
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white flex flex-col justify-center items-center">
                        <img
                            src={immm}
                            alt="Forgot Password Illustration"
                            className="mb-8 rounded-2xl h-[200]"
                        />
                        <h2 className="text-3xl font-bold mb-4">Password Recovery</h2>
                        <p className="text-blue-100 text-center">Enter your email to receive a password reset link</p>
                    </div>
                    
                    <div className="md:w-1/2 p-12">
                        <div className="max-w-sm mx-auto">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Forgot Password</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={changeHandler}
                                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Send Reset Link
                                </button>
                            </form>
                            
                            <div className="mt-6 text-center text-sm">
                                <span className="text-gray-600">Remember your password? </span>
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