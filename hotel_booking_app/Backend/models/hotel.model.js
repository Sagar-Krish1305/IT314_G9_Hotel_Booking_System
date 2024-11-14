import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true
    },
    images: [{
            type: String
        }]
}, { _id: false }, 
   {timestamps : true});


const hotelPoliciesSchema = new Schema({
    checkInTime: {
        type: String,
        required: true,
        trim: true
    },
    checkOutTime: {
        type: String,
        required: true,
        trim: true
    },
    cancellationPolicy: {
        type: String,
        required: true,
        trim: true
    },
    childrenAndBedsPolicy: {
        type: String,
        required: true,
        trim: true
    },
    ageRestriction: {
        type: Boolean,
        default: false
    },
    petPolicy: {
        type: String,
        required: true,
        trim: true
    },
    partiesAllowed: {
        type: Boolean,
        default: false
    }
});




const hotelDetailsSchema = new Schema({
    hotelName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    // type: {
    //     type: String,
    //     enum: ['luxury', '4star', 'normal'],
    //     required: true
    // },

    roomCount: {
        type: Number,
        required: true
    },

    facilities: {
        type: [String],
        default: []
    },

    pricePerNight: {
        type: Number,
        required: true
    },

    ratings: [ratingSchema],

    images: {
        type: [String],
        default: [],
        // required: true
    },

    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],

    contactNo: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, {
    timestamps: true
});

export const HotelDetails = mongoose.model("HotelDetails", hotelDetailsSchema);
