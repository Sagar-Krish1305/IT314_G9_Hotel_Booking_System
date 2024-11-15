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


// Check booking credential before going to booking confirm page
const checkBookingCredential = asyncHandler(async(req,res)=>{
    const {checkInDate, checkOutDate, requiredRooms} = req.body

    if([checkInDate, checkOutDate, requiredRooms].some((field)=>field?.trim === "")){
        throw new ApiError(400, "Check-In-Date, Check-Out-Date and Number of Rooms must be provided")
    }

    const hotelID = req.params.hotelId;

    const hotel = await HotelDetails.findById(hotelID);

    if(!hotel){
        throw new ApiError(400, "Hotel doesn't found with this hotel ID");
    }

    const bookedRooms = await BookingDetails.aggregate([
        {
            $match: {
                hotelId: hotel._id,

                $and: [
                    { checkIn: { $lte: new Date(checkOutDate) } },
                    { checkOut: { $gte: new Date(checkInDate) } }
                ]
            }
        },
        {
            $group: {
                _id: "$hotelId",
                totalRoomsBooked: { $sum: "$roomCount" }
            }
        }
    ]);

    const totalRoomsBooked = bookedRooms.length > 0 ? bookedRooms[0].totalRoomsBooked : 0;
    const availableRooms = hotel.roomCount - totalRoomsBooked;

    // Check if the available rooms meet the required number of rooms
    if (availableRooms >= requiredRooms) {
        res
        .status(200)
        .json(
            new ApiResponse(400, hotel, "Rooms are available for booking during this time")
        )
    }
    else{
        res
        .status(200)
        .json(
            new ApiResponse(400,hotel, "Not enough rooms to book during this time")
        )
    }
});


//Booking Cancellation
const handlBookingcancellation = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    try {
        const booking = await BookingDetails.findById(bookingId);
        
        //check booking is exist or not
        if (!booking) {
            throw new ApiError(404, "Booking Not Found!"); 
        }

        const currentDate = new Date();
        const checkInDate = new Date(booking.checkInDate);

        // if currentDate exceeds checkInDate than user cann't cancel rooms
        if (currentDate > checkInDate) {   
            throw new ApiError(400, "Cannot cancel after Check In");
        }

        // check if hotel exists
        const hotel = await HotelDetails.findById(booking.hotelId);
        if (!hotel) {
            throw new ApiError(404,"Associated hotel not found");
        }
        
        //Update availabeRooms in hotel dataBase
        hotel.availableRooms += booking.roomCount;

        await hotel.save();

        //delete booking 
        await BookingDetails.findByIdAndDelete(bookingId);
        
        res.status(200).json(
            new ApiResponse(200, null, "Booking successfully canceled and rooms updated")
        );

    } catch (error) {
        throw new ApiError(500,error.message || 'Internal Server Error');
    }

});

export {
    handleBookingRequest,
    checkBookingCredential,
    handlBookingcancellation
}
