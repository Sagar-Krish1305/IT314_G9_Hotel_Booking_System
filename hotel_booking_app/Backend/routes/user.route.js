import express from 'express'
import { login } from '../controllers/loginhandle.js';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';
import { googleSignIn } from '../controllers/googleAuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { updateProfile } from '../controllers/updateProfile.js';
import { handlegetPreviousBookings } from '../controllers/user.controller.js';
import { newmessage } from '../controllers/registerhandle.js';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key';
const Router = express.Router();

Router.post("/createlogin", login);
Router.post("/createmessage", newmessage);
Router.post("/forgot-password", forgotPassword);

Router.post("/reset-password", resetPassword);

Router.post("/google-signin", googleSignIn);
Router.put('/update-profile', authMiddleware, updateProfile);

Router.get("/bookig-history", authMiddleware, handlegetPreviousBookings);

Router.get('/verify-token', async (req, res) => {
    // console.log(req.header('Authorization'));
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // console.log(token);
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
    //   console.log(decoded);

    // jwt.verify(token, JWT_SECRET, (err, user) => {

    //     if (err) {
    //         console.log(err);
    //         return res.status(403).json({ message: "Invalid token!" });
    //     }

    //     req.user = user;
    // });

      
      // Fetch user details if needed
      // const user = await User.findById(decoded.userId);
      
      return res.status(200).json({
        success: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          firstName : decoded.firstName,
          lastName : decoded.lastName,
          mobileNumber : decoded.mobileNumber
          // Add other non-sensitive user details as needed
        }
      });
    } catch (error) {
        console.log(error);
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  });

export default Router