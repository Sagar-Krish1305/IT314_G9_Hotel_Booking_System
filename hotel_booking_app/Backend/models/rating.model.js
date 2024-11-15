import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
    hotelId: {
        type: Schema.Types.ObjectId,
        ref: "HotelDetails",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    overallRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewTitle: {
        type: String,
        required: true,
        trim: true
    },
    reviewDescription: {
        type: String,
        required: true,
        trim: true
    },
    serviceRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    roomsRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    cleanlinessRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    foodRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewImages: {
        type: [String],
        defaule: []
    }
},
    { timestamps: true });

export const Rating = mongoose.model("Rating", ratingSchema);