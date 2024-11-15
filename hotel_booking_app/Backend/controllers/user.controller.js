//User Registar,hotelbooking and Ratings related controller should be here!!
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Rating } from "../models/rating.model.js";  
import { User } from "../models/user.model.js";
import { BookingDetails } from "../models/booking.model.js";
import { HotelDetails } from "../models/hotel.model.js";


const handleAddRatings = asyncHandler(async (req, res) => {
    const {
        overallRating,
        reviewTitle,
        reviewDescription,
        serviceRating,
        roomsRating,
        cleanlinessRating,
        foodRating
    } = req.body;
    
    const hotelId = req.params.hotelId;
    const userId = req.user?._id;

    //check all fields  
    if (!overallRating || !reviewTitle || !reviewDescription || !serviceRating || !roomsRating || !cleanlinessRating || !foodRating) {
        throw new ApiError(400, "All fields are required.");
    }

    //check userid id valid or not
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    //check hotelid valid or not
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        throw new ApiError(400, "Invalid hotel ID.");
    }
    
    const user = User.find({ userId });
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    
    // console.log(hotelId);

    const hotel = await HotelDetails.findById(hotelId);
    if (!hotel) {
        throw new ApiError(404, "Hotel not found.");
    }

    //upload images on cloudinary and store secure urls in dataBase
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            imageUrls.push(result.secure_url);
        }
    }

    try {
        const newRating = await Rating.create({
            hotelId,
            userId,
            overallRating,
            reviewTitle,
            reviewDescription,
            serviceRating,
            roomsRating,
            cleanlinessRating,
            foodRating,
            reviewImages: imageUrls
        });
        
        hotel.ratings.push(newRating._id);
        
        await hotel.save();

        res.status(201).json(new ApiResponse(201, "Rating added successfully.", newRating));

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
    
});

const handlegetPreviousBookings = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    try {
        const previousBooking = await BookingDetails.find({ userId });
       
        return res
        .status(200)
        .json(200, previousBooking, "Previous Booking Details return successfully");
    } catch (error) {
        throw new ApiError(500,"An error occurred while retrieving booking history.");
    }
});


export {
    handleAddRatings,
    handlegetPreviousBookings
};
