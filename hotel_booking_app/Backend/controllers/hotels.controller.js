// Hotel Register, Search and all hotel related controllers should be here!!
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { HotelDetails } from "../models/hotel.model.js";
import { BookingDetails } from "../models/booking.model.js";
import { Rating } from "../models/booking.model.js";


const RegisterHotel = asyncHandler(async (req, res) => {
    // data from body
    // validation
    // check if hotel already exist
    // check for images
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password field from response
    // check for hotel creation
    // return response

    const { hotelName, city, country, address, description,
        roomCount, pricePerNight, contactNo, email, type, facilities, password } = req.body

    if (
        [hotelName, city, country, address, description,
            roomCount, pricePerNight, contactNo, email, password].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All mandatory field is required")
    }

    let imagesss;
    const imageUrls = [];

    if (req.files && Array.isArray(req.files.images) && req.files.images.length > 0) {
        imagesss = req.files.images;
        for (const image of imagesss) {
            const uploadurl = await uploadOnCloudinary(image.path);
            if (!uploadurl) {
                throw new ApiError(500, "Couldn't upload image on cloudinary");
            }
            imageUrls.push(uploadurl.url)
        }
    }

    const facilitiesArray = facilities.split(",");

    const hotel = await HotelDetails.create({
        hotelName,
        city: city.toLowerCase(),
        country: country.toLowerCase(),
        address,
        description,
        roomCount,
        type,
        facilities,
        pricePerNight,
        contactNo,
        email,
        password,
        images: imageUrls
    })

    const createdHotel = await HotelDetails.findById(hotel._id).select(
        "-password -refreshToken"
    )

    if (!createdHotel) {
        throw new ApiError(500, "something went wrong while registering the hotel")
    }

    res.status(200).json(
        new ApiResponse(200, createdHotel, "Hotel Registered Successfully")
    )
})




const handleSearchRequest = asyncHandler(async (req, res) => {
    // data : {city, checkindate,checkoutdate, no of required rooms}
    // retrive all hotels - in the city, with available no of rooms during booking period
    //    --> retrive hotels which are in the city
    //    --> for each hotel look in bookingDetails and retrive no of booking of that hotel during booking period 
    //    --> store all hotels for which available room is more than required rooms

    const { city, checkInDate, checkOutDate, requiredRooms } = req.body
    // console.log("123");
    // console.log(req.body);
    // console.log(city, checkInDate, checkOutDate, requiredRooms);
    if (!(city)) {
        throw new ApiError(400, "city/country/hotel name is required")
    }

    // Find hotels in the specified city
    const hotelsInCity = await HotelDetails.find({
        $or: [
            { city: new RegExp(city, "i") },
            { country: new RegExp(city, "i") },
            { name: new RegExp(city, "i") }
        ]
    });

    if ((checkInDate && !checkOutDate) || (checkOutDate && !checkInDate)) {
        throw new ApiError(400, "Both CheckInDate and checkOutDate is required")
    }

    let availableHotels = [];
    if (checkInDate && checkOutDate) {
        // Iterate over each hotel and check room availability
        for (const hotel of hotelsInCity) {
            const bookedRooms = await BookingDetails.aggregate([
                {
                    $match: {
                        hotelId: hotel._id,
                        $and: [
                            { checkInDate: { $lte: new Date(checkOutDate) } },
                            { checkOutDate: { $gte: new Date(checkInDate) } }
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
                const { address, description, type, roomCount, facilities, contactNo, email, password, ...hotelData } = hotel.toObject();
                availableHotels.push({ ...hotelData, availableRooms });
            }
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, availableHotels, "All hotels with required search condition is returned")
            )
    }

    for (const hotel of hotelsInCity) {
        const { address, description, type, roomCount, facilities, contactNo, email, ...hotelData } = hotel.toObject();
        availableHotels.push({ hotelData });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, availableHotels, "All hotels with required search condition is returned")
        )

})


const getDetailsOfHotel = asyncHandler(async (req, res) => {

    const hotelId = req.params.hotelId.slice(1);
    const hotel = await HotelDetails.findById(hotelId).select("-password")
        .populate({
            path: "ratings",
            populate: {
                path: "userId",
                select: "first_name last_name",
            },
        });
    if (!hotel) {
        throw new ApiError(400, "Hotel not found");
    }

    //if there is no rating for hotel
    if (hotel.ratings.length === 0 || !hotel.ratings) {
        return res
            .status(200)
            .json(new ApiResponse(200, hotel, "No ratings found for this hotel"));
    }

    let averageOverallRatings = 0,
        averageServiceRatings = 0,
        averageRoomsRatings = 0,
        averageCleanlinessRatings = 0,
        averageFoodRatings = 0;

    hotel.ratings.forEach((rating) => {
        averageOverallRatings += rating.overallRating;
        averageServiceRatings += rating.serviceRating;
        averageRoomsRatings += rating.roomsRating;
        averageCleanlinessRatings += rating.cleanlinessRating;
        averageFoodRatings += rating.foodRating;
    });

    const totalRatings = hotel.ratings.length;
    const allAverageRatings = {
        averageOverallRatings: Number(averageOverallRatings / totalRatings).toFixed(2),
        averageServiceRatings: Number(averageServiceRatings / totalRatings).toFixed(2),
        averageRoomsRatings: Number(averageRoomsRatings / totalRatings).toFixed(2),
        averageCleanlinessRatings: Number(averageCleanlinessRatings / totalRatings).toFixed(2),
        averageFoodRatings: Number(averageFoodRatings / totalRatings).toFixed(2)
    };

    //now user wise ratings with user's name, reviewDescription and reviewImages

    let userWiseRatings = [];
    hotel.ratings.forEach((rating) => {
        const { userId, reviewTitle, reviewDescription, overallRating, reviewImages } = rating;
        userWiseRatings.push({
            userName: `${userId.first_name} ${userId.last_name}`,
            reviewTitle,
            reviewDescription,
            overallRating,
            reviewImages
        });
    });

    // return object with allAverageRatings and userWiseRatings
    return res
        .status(200)
        .json(new ApiResponse(200, { hotel, allAverageRatings, userWiseRatings }, "Hotel ratings and other data retrieved successfully"));
});

const handleAddReviewRequest = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const hotelId = req.params.hotelId.slice(1);

    // Check if the hotel has been booked by the user
    const booking = await BookingDetails.findOne({ userId, hotelId });

    if (!booking) {
        throw new ApiError(400, "You have never booked the hotel.");
    }

    const { overallRating, reviewTitle, reviewDescription, serviceRating, roomsRating, cleanlinessRating, foodRating } = req.body;

    if (!overallRating || !reviewDescription || !serviceRating || !roomsRating || !cleanlinessRating || !foodRating) {
        throw new ApiError(400, "Please provide all the ratings ");
    }

    const hotel = await HotelDetails.findById(hotelId).select("-password").populate("ratings");

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

export {
    RegisterHotel,
    handleSearchRequest,
    getDetailsOfHotel,
    handleAddReviewRequest
}