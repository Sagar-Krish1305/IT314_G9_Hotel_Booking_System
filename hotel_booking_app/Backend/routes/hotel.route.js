// All routers code should be update here

// import { Router } from "express";
import { getDetailsOfHotel, handleSearchRequest, RegisterHotel, handleGetReviewRequest } from "../controllers/hotels.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { handleAddRatings } from "../controllers/user.controller.js";

import express from 'express';
import { body,validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { newmessage } from '../controllers/registerhandle.js';

const router = express.Router();

import { handlBookingcancellation, handleBookingRequest } from "../controllers/bookings.controller.js"


router.post("/createmessage", newmessage);



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

// module.exports = router;

// module.exports = router;

// const router = Router()

// router.route("/hotelRegister").post(
//     upload.fields([
//         {
//             name: "images",
//             maxCount: 6
//         }
//     ]),
//     RegisterHotel
// )

router.route("/hotelRegister").post(
    upload.fields([
        {
            name: "images",
            maxCount: 6
        }
    ]),
    [
        // Validation rules 
        body("hotelName")
            .notEmpty()
            .withMessage("Hotel name is required.")
            .isLength({ min: 3 })
            .withMessage("Hotel name must be at least 3 characters long."),
        
        body("city")
            .notEmpty()
            .withMessage("City is required."),
        
        body("country")
            .notEmpty()
            .withMessage("Country is required."),
        
        body("address")
            .notEmpty()
            .withMessage("Address is required."),
        
        body("description")
            .isLength({ max: 500 })
            .withMessage("Description can be up to 500 characters long."),
        
        body("contactNo")
            .notEmpty()
            .withMessage("Contact number is required.")
            .matches(/^\d{10}$/)
            .withMessage("Contact number must be a valid 10-digit number."),
        
        body("email")
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("A valid email is required."),
        
        body("password")
            .notEmpty()
            .withMessage("Password is Required."),
    ],
        RegisterHotel
);


router.get("/:hotelId", getDetailsOfHotel);

router.route("/:hotelId/addRatings").post(
    upload.fields([
        {
            name: "images",
            maxCount: 5
        }
    ]),
    handleAddRatings
);


router.post("/search",[
        
    //validation rules 
    body("city")
        .notEmpty()
        .withMessage("City is required."),
    body("checkInDate")
        .notEmpty()
        .withMessage("Check-in date is required."),
    body("checkOutDate")
        .notEmpty()
        .withMessage("Check-out date is required.")
        .custom((value, { req }) => {
            const checkIn = new Date(req.body.checkInDate);
            const checkOut = new Date(value);
            if (checkIn > checkOut) {
                throw new Error("Check-out date must be after or the same as the check-in date.");
            }
            return true;
        }),
        
], handleSearchRequest);
// router.route("/search").post(
//     handleSearchRequest
// )

router.post("/:hotelId/confirm-booking", handleBookingRequest);
router.delete("/:bookingId", handlBookingcancellation);
router.get("/:hotelId/rating-and-reviews", handleGetReviewRequest);

export default router