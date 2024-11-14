// Hotel Register, Search and all hotel related controllers should be here!!
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { HotelDetails } from "../models/hotel.model.js";


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


export {
    RegisterHotel
}
