import mongoose, { Schema } from "mongoose";


const bookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hotelId: {
        type: Schema.Types.ObjectId,
        ref: "HotelDetails",
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    roomCount: {
        type: Number,
        required: true,
        min: 1
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export const BookingDetails = mongoose.model("BookingDetails", bookingSchema);