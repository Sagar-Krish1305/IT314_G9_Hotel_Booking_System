// Hotel Register, Search and all hotel related controllers should be here!!
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { HotelDetails } from "../models/hotel.model.js";
import { BookingDetails } from "../models/booking.model.js";


const RegisterHotel = asyncHandler(async(req, res)=>{
    // data from body
    // validation
    // check if hotel already exist
    // check for images
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password field from response
    // check for hotel creation
    // return response

    const {hotelName, city, country, address, description,
           roomCount, pricePerNight, contactNo, email, password} = req.body
    
    if(
        [hotelName, city, country, address, description,
            roomCount, pricePerNight, contactNo, email, password].some((field)=>field?.trim === "")
    ){
        throw new ApiError(400, "All mandatory field is required")
    }

    let imagesss;
    const imageUrls = [];

    if(req.files && Array.isArray(req.files.images) && req.files.images.length > 0){
        imagesss = req.files.images; 
        for(const image of imagesss){
            const uploadurl = await uploadOnCloudinary(image.path);
            if(!uploadurl){
                throw new ApiError(500, "Couldn't upload image on cloudinary");
            }
            imageUrls.push(uploadurl.url)
        }
    }

    const hotel = await HotelDetails.create({
        hotelName,
        city : city.toLowerCase(), 
        country : country.toLowerCase(),
        address, 
        description,
        roomCount, 
        pricePerNight, 
        contactNo, 
        email,
        password,
        images: imageUrls
    })

    const createdHotel = await HotelDetails.findById(hotel._id).select(
        "-password -refreshToken"
    )
    
    if(!createdHotel){
        throw new ApiError(500, "something went wrong while registering the hotel")
    }

    res.status(200).json(
        new ApiResponse(200, createdHotel, "Hotel Registered Successfully") 
    )
})




const handleSearchRequest = asyncHandler(async(req,res)=>{
    // data : {city, checkindate,checkoutdate, no of required rooms}
    // retrive all hotels - in the city, with available no of rooms during booking period
    //    --> retrive hotels which are in the city
    //    --> for each hotel look in bookingDetails and retrive no of booking of that hotel during booking period 
    //    --> store all hotels for which available room is more than required rooms

    const {city, checkInDate, checkOutDate, requiredRooms} = req.body
    // console.log("123");
    // console.log(req.body);
    // console.log(city, checkInDate, checkOutDate, requiredRooms);
    if(!(city && checkInDate && checkOutDate && requiredRooms)){
        throw new ApiError(400, "all fields are required")
    }

    // Find hotels in the specified city
    const hotelsInCity = await HotelDetails.find({ city });

    const availableHotels = [];

    // Iterate over each hotel and check room availability
    for (const hotel of hotelsInCity) {
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
            const { roomCount, password, ...hotelData } = hotel.toObject();
            availableHotels.push({...hotelData, availableRooms});
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, availableHotels, "All hotels with required search condition is returned")
    )

})



export {
    RegisterHotel,
    handleSearchRequest
}
