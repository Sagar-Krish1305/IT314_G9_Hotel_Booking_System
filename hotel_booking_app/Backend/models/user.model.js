const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const messageapp = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    last_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    e_mail: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    mobile_number: {
      type: String,
      required: true,
      maxlength: 15,
      default: "Not provided" // Add this line
    },
    password: {
      type: String,
      required: true,
    },
    confirm_password: {
      type: String,
      // Remove the required field or set it to false
    },
    user_type: {
      type: String,
      enum: ['admin', 'customer', 'manager'],
      default: 'customer',
    },
    
    bookingHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "BookingDetails"
        }
    ],

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    }
  }
);

// Hash password before saving
messageapp.pre('save', async function(next) {
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
  messageapp.methods.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  };
  
  

module.exports = mongoose.model("User", messageapp);