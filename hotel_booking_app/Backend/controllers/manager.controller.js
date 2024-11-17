import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { HotelDetails } from "../models/hotel.model.js";
import { BookingDetails } from "../models/booking.model.js";

const editHotelDetails = asyncHandler(async (req, res) => {
    // get edit parameters from request body
    // find hotel by hotelId
    // update hotel details
    // return response
    const { address, description,
        roomCount, pricePerNight, contactNo, email, facilities } = req.body;
    const hotel = await HotelDetails.findOne({ email: email });
    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    const updatedHotel = await HotelDetails.findByIdAndUpdate(hotel._id, {
        address,
        description,
        roomCount,
        pricePerNight,
        contactNo,
        facilities
    }, { new: true, runValidators: true });

    if (!updatedHotel) {
        throw new ApiError(500, "Couldn't update hotel details");
    }

    res.status(200).json(new ApiResponse(200, { hotel: updatedHotel }, "Hotel details updated successfully"));
});

const hotelDetails = asyncHandler(async (req, res) => {
    // get hotel details by email of a manager
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const hotel = await HotelDetails.findOne({ email });
    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }
    return res.status(200).json(new ApiResponse(200, hotel, "Hotel details fetched successfully"));
});

export { editHotelDetails, hotelDetails };