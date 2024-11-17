import { editHotelDetails, hotelDetails } from "../controllers/manager.controller.js";
import express from 'express'

const router = express.Router();

router.put("/edit-hotel-details", editHotelDetails);
router.get("/", hotelDetails);