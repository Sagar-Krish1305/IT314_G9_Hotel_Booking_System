import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
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
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: "Rating"
    }],
    images: {
        type: [String],
        default: [],
        // required: true
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BookingDetails'
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
        //required: [true, 'Password is required']
    }
}, {
    timestamps: true
});

hotelDetailsSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
      // Hash the password with bcrypt
      this.password = await bcrypt.hash(this.password, 10);
      
      // If confirm_password exists and has been modified, hash it too
      if (this.confirm_password && this.isModified('confirm_password')) {
        this.confirm_password = await bcrypt.hash(this.confirm_password, 10);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  });
  
  // 2. Add a method to compare passwords
  hotelDetailsSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  };

export const HotelDetails = mongoose.model("HotelDetails", hotelDetailsSchema);
