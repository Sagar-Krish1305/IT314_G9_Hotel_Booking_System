// All routers code should be update here

import { Router } from "express";
import { handleSearchRequest, RegisterHotel } from "../controllers/hotels.controller.js";
import { upload } from "../middlewares/multer.middleware.js";



const router = Router()

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

route.post("/confirm-booking", handleBookingRequest);

export default router