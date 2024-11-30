import { editHotelDetails, getBookings, hotelDetails, managerLogin } from "../controllers/manager.controller.js";
import express from 'express'

const router = express.Router();

router.post("/login", managerLogin);
router.post("/edit-hotel-details", editHotelDetails);
router.get("/", hotelDetails);
router.get("/:hotelId/booking-history", getBookings);

export default router
