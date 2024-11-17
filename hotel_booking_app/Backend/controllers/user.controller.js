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
import { validationResult } from "express-validator";


const handleAddRatings = asyncHandler(async (req, res) => {

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiResponse(400, { errors: errors.array() }, "Validation Error"));
    }

    // console.log(req.body);
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

    const user = await User.find({ userId });
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

        res.status(201).json(new ApiResponse(201, newRating, "Rating added successfully."));

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }

});

const handlegetPreviousBookings = asyncHandler(async (req, res) => {
    // const userId = req.user._id;
    const userId = req.body.userId;
    try {
        // console.log(userId);
        const previousBookings = await BookingDetails.find({ userId });

        // console.log(previousBookings);

        let bookedHotels = [];
        for (const previousBooking of previousBookings) {
            const hotelId = previousBooking.hotelId;

            // fetching require fields
            const hotel = await HotelDetails.findById(hotelId).select("hotelName city");
            const booking = await BookingDetails.findById(previousBooking._id).select("checkInDate checkOutDate roomCount totalCost");

            if (hotel && booking) {
                const bookedHotel = {
                    hotelName: hotel.hotelName,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    city: hotel.city,
                    bookedRooms: booking.roomCount,
                    totalCost: booking.totalCost,
                };

                // console.log(bookedHotel);
                bookedHotels.push(bookedHotel);
            }
        };

        // console.log("--->",book  edHotels);
        return res
            .status(200)
            .json(new ApiResponse(200, bookedHotels, "Previous Booking Details return successfully"));

    } catch (error) {
        throw new ApiError(500, "An error occurred while retrieving booking history.");
    }
});


export {
    handleAddRatings,
    handlegetPreviousBookings
};
