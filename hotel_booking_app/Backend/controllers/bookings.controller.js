import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { HotelDetails } from "../models/hotel.model.js";
import { BookingDetails } from "../models/booking.model.js";

const handleBookingRequest = asyncHandler(async (req, res) => {
    // data from body
    // validation
    // check if hotel already exist
    // check for images
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password field from response
    // check for hotel creation
    // return response

    const { hotelId, firstName, lastName, email, checkInDate, checkOutDate, phone, roomCount, totalCost } = req.body;

    // const userId = req.user?._id;
    const userId = Math.random().toString(36).substring(2, 12);
    // console.log(userId);

    if (
        [hotelId, firstName, lastName, email, checkInDate, checkOutDate, phone, roomCount, totalCost].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All mandatory field is required");
    }

    const hotel = await HotelDetails.findById(hotelId);

    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }
    const booking = await BookingDetails.create({
        userId,
        hotelId,
        firstName,
        lastName,
        email,
        phone,
        roomCount,
        checkInDate,
        checkOutDate,
        totalCost
    });

    const createdBooking = await BookingDetails.findById(booking._id).select(
        "-__v"
    );

    if (!createdBooking) {
        throw new ApiError(500, "something went wrong while confirming the booking")
    }

    // // Now, add bookingId to the `bookings` array in the hotel document
    // await HotelDetails.findByIdAndUpdate(
    //     hotelId, // ID of the hotel
    //     { $push: { bookings: bookingId } }, // Push the booking _id to bookings array
    //     { new: true, useFindAndModify: false } // Options: return updated document and avoid deprecated warnings
    // );

    hotel.bookings.push(createdBooking._id);

    await hotel.save({ validateBeforeSave: false });

    // Enter the booking into the user as well.

    await User.findByIdAndUpdate(
        userId,
        { $push: { bookingHistory: createdBooking._id } },
        { new: true, useFindAndModify: false } // Options to avoid deprecated warnings and get the updated document
    );

    res.status(201).json(
        new ApiResponse(201, booking, "Booking confirmed successfully")
    )
});

export {
    handleBookingRequest
}
