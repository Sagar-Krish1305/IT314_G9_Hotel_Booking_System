import React, { useState } from 'react';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    function changeHandler(event) {
        setEmail(event.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/forgot-password', {
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
        <>
            <div className='text-2xl font-bold flex justify-center items-center w-[435px] h-[50px] mt-[30px] mb-[10px] mx-auto border-3 border-black rounded-[10px]'>Forgot Password</div>
            <div className="w-full max-w-[400px] mx-auto p-5 bg-white shadow-md rounded-lg">
                <form onSubmit={handleSubmit}>
                    <label className="block text-base text-gray-700 mb-2">
                        📧 Email Address <sup className="text-red-500">*</sup>
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={changeHandler}
                        name="email"
                        className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
                    <button type="submit" className="w-full mt-2 bg-purple-700 hover:bg-purple-800 text-white text-xl py-2 px-4 rounded-md transition-colors duration-300">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </>
    );
};