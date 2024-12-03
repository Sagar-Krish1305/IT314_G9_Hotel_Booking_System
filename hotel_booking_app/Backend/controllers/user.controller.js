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

    // console.log(req.body);
    const {
        rating,
        title,
        details,
        service,
        rooms,
        cleanliness,
        food
    } = req.body;

    const hotelId = req.params.hotelId;

    const userId = req.user.userId;


    //check all fields  
    if (!rating || !title || !details || !service || !rooms || !cleanliness || !food) {
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
            overallRating : rating,
            reviewTitle : title,
            reviewDescription : details,
            serviceRating : service,
            roomsRating : rooms,
            cleanlinessRating : cleanliness,
            foodRating : food
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
    const userId = req.user.userId;
    try {
        // console.log(userId);
        const previousBookings = await BookingDetails.find({ userId });



        let bookedHotels = [];
        for (const previousBooking of previousBookings) {
            const hotelId = previousBooking.hotelId;

            // fetching require fields
            const hotel = await HotelDetails.findById(hotelId).select("-password");
            const booking = await BookingDetails.findById(previousBooking._id);
            //console.log(hotel, booking);
            if (hotel && booking) {
                const bookedHotel = {
                    bookingId: booking._id,
                    hotelId: hotel._id,
                    hotelName: hotel.hotelName,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    firstName : booking.firstName,
                    lastName : booking.lastName,
                    pricePerNight : hotel.pricePerNight,
                    roomsBooked: booking.roomCount,
                    totalPayment: booking.totalCost,
                    email : booking.email,
                    hotelPhotoUrl: hotel.images[0]
                };


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
