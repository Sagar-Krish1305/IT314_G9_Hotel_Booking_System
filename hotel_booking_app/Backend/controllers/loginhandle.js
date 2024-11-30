import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js'; 
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse.js';

const JWT_SECRET = 'your-secret-key'; // Replace with a secure secret key

const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ e_mail: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.e_mail, userType: user.user_type , mobileNumber:user.mobile_number , firstName:user.first_name , lastName:user.last_name},
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        mobileNumber: user.mobile_number,
        userType: user.user_type,
        email: user.e_mail
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { login } 