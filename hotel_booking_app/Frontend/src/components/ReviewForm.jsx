import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie'
import config from '../config';

function ReviewForm() {
    const [rating, setRating] = useState(0);
    const [service, setService] = useState(0);
    const [rooms, setRooms] = useState(0);
    const [cleanliness, setCleanliness] = useState(0);
    const [food, setFood] = useState(0);
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [tips, setTips] = useState('');
    const [photos, setPhotos] = useState([]);
    const [certify, setCertify] = useState(false);

    const handlePhotoUpload = (e) => {
        setPhotos([...photos, ...e.target.files]);
    };

    const navigate = useNavigate();
    const {id} = useParams();
    
    const handleData = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        const formData = {
            rating,
            service,
            rooms,
            cleanliness,
            food,
            title,
            details,
            tips,
            photos: photos.map(photo => photo.name), // Only save file names
            certify,
        };
        

    
        try {
            const token = Cookies.get('token');
            console.log("shaym id, ",id);
            const response = await fetch(`${config.BACKEND_ID}/api/v1/hotels/${id}/addRatings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                alert('Review submitted successfully!');
            } else {
                console.error('Failed:', response.status, response.statusText);
                alert('Failed to submit the review. Please try again.');
            }

            navigate( `/hotel/${id}`);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting your review. Please try again later.');
            navigate( `/hotel/${id}`);
        }
    };

    return (
        <form onSubmit={handleData}>
            <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Write your review here</h2>

                {/* Overall Rating */}
                <label className="block text-lg font-semibold mb-2">Overall Rating</label>
                <div className="flex space-x-1 mb-4">
                    {[...Array(5)].map((_, index) => (
                        <FaStar
                            key={index}
                            onClick={() => setRating(index + 1)}
                            className={`cursor-pointer text-2xl ${
                                index < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Title of Review */}
                <label className="block text-lg font-semibold mb-2">Title of your review</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your visit or highlight an interesting detail"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                />

                {/* Details of Review */}
                <label className="block text-lg font-semibold mb-2">Details of your review</label>
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Tell people about your experience: your room, location, amenities?"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg h-24"
                ></textarea>

                {/* Service, Rooms, Cleanliness, Food Ratings */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    {['Service', 'Rooms', 'Cleanliness', 'Food'].map((category, index) => (
                        <div key={index} className="text-center">
                            <label className="block text-lg font-semibold mb-2">{category}</label>
                            <div className="flex justify-center space-x-1">
                                {[...Array(5)].map((_, idx) => (
                                    <FaStar
                                        key={idx}
                                        onClick={() => {
                                            switch (category) {
                                                case 'Service':
                                                    setService(idx + 1);
                                                    break;
                                                case 'Rooms':
                                                    setRooms(idx + 1);
                                                    break;
                                                case 'Cleanliness':
                                                    setCleanliness(idx + 1);
                                                    break;
                                                case 'Food':
                                                    setFood(idx + 1);
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }}
                                        className={`cursor-pointer text-xl ${
                                            idx < eval(category.toLowerCase()) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Room Tips */}
                <label className="block text-lg font-semibold mb-2">Add a tip to help travelers choose a good room</label>
                <input
                    type="text"
                    value={tips}
                    onChange={(e) => setTips(e.target.value)}
                    placeholder="E.g., Best views, quieter floors, accessibility, etc."
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                />

                {/* Photo Upload */}
                <label className="block text-lg font-semibold mb-2">Do you have photos to share? (Optional)</label>
                <input
                    type="file"
                    multiple
                    onChange={handlePhotoUpload}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-wrap gap-2 mb-4">
                    {photos.map((photo, index) => (
                        <span key={index} className="text-sm text-blue-500 underline">
                            {photo.name}
                        </span>
                    ))}
                </div>

                {/* Certification */}
                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={certify}
                        onChange={() => setCertify(!certify)}
                        className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                        I certify that this review is based on my own experience and is my genuine opinion of this
                        hotel, and that I have no personal or business relationship with this establishment, and have
                        not been offered any incentive or payment originating from the establishment to write this
                        review. I understand that TripFinder has a zero-tolerance policy on fake reviews.
                    </span>
                </label>

                {/* Submit Button */}
                <button
                    onClick={handleData}
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
                    disabled={!certify}
                >
                    Submit Your Review
                </button>
            </div>
        </form>
    );
}

export default ReviewForm;
