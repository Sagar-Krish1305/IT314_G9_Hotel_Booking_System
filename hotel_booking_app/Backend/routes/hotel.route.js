// All routers code should be update here

// import { Router } from "express";
import { handleSearchRequest, RegisterHotel } from "../controllers/hotels.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const { newmessage } = require("../controllers/messagehandle");
const { login } = require("../controllers/loginhandle");
const { forgotPassword, resetPassword } = require("../controllers/passwordResetController");
const { googleSignIn } = require("../controllers/googleAuthController");
const { updateProfile } = require("../controllers/updateProfile");
const authMiddleware = require('../middleware/authMiddeleware');


router.post("/createmessage", newmessage);
router.post("/createlogin", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google-signin", googleSignIn);
router.put('/update-profile', authMiddleware, updateProfile);


const JWT_SECRET = 'your-secret-key';

router.get('/api/v1/verify-token', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user details if needed
    // const user = await User.findById(decoded.userId);
    
    res.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        // Add other non-sensitive user details as needed
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;

module.exports = router;

// const router = Router()

router.route("/hotelRegister").post(
    upload.fields([
        {
            name: "images",
            maxCount: 6
        }
    ]),
    RegisterHotel
)

router.post("/search", handleSearchRequest);
// router.route("/search").post(
//     handleSearchRequest
// )

//route.post("/confirm-booking", handleBookingRequest);

export default router