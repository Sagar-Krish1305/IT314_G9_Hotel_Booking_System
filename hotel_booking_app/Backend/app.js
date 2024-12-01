import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: 'https://stayeazy.vercel.app',  // Specify the origin
    credentials: true                // Allow credentials
  }));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// Base router file should be updated here
import hotelRouter from "./routes/hotel.route.js"
import userRouter from "./routes/user.route.js";
import managerRouter from "./routes/manager.route.js";

app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/manager", managerRouter);

export { app }
