//User Registar,hotelbooking and Ratings related controller should be here!!
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Rating } from "../models/rating.model.js";  
import { User } from "../models/user.model.js";

const handleAddRatings = asyncHandler(async (req, res) => {
    const {
        userId,
        overallRating,
        reviewTitle,
        reviewDescription,
        serviceRating,
        roomsRating,
        cleanlinessRating,
        foodRating
    } = req.body;

    if (!userId || !overallRating || !reviewTitle || !reviewDescription || !serviceRating || !roomsRating || !cleanlinessRating || !foodRating) {
        throw new ApiError(400, "All fields are required.");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }
    
    const user = User.find({ userId });
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            imageUrls.push(result.secure_url);
        }
    }

    const newRating = await Rating.create({
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
    
    res.status(201).json(new ApiResponse(201, "Rating added successfully.", newRating));
});

export { handleAddRatings };
